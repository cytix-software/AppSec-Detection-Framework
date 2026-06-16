import type { DataJson, MappingOut, ParserInput, ParseContext } from "../../utils/types";
import { ScannerParsingError } from "../errors/ScannerParsingError";
import { BaseScannerParser } from "./parser";

type NucleiClassification = {
  // Nuclei classification fields:
  "cwe-id"?: string[] | string | null;
  "cve-id"?: string[] | string | null;
  [k: string]: unknown;
};

type NucleiInfo = {
  name?: string;
  severity?: string;
  classification?: NucleiClassification | null;
  [k: string]: unknown;
};

type NucleiFinding = {
  // Nuclei JSON output fields
  "template-id"?: string;
  "template-path"?: string;
  "matcher-name"?: string | null;
  host?: string;
  port?: string | number;
  "matched-at"?: string;
  timestamp?: string; // ISO
  info?: NucleiInfo;
  [k: string]: unknown;
};

function parseEpochFromIsoOrFallback(iso?: string, fallbackEpoch?: number): number | undefined {
  if (!iso) return fallbackEpoch;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return fallbackEpoch;
  return Math.floor(ms / 1000);
}

/**
 * Normalizes:
 *  - "cwe-200" -> 200
 *  - "CWE-22"  -> 22
 *  - "22"      -> 22
 */
function normalizeCweId(raw: unknown): number | null {
  if (raw == null) return null;

  if (typeof raw === "string") {
    const m = raw.match(/(\d+)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  return null;
}

export class NucleiJsonParser extends BaseScannerParser {
  constructor() {
    super("Nuclei", "Nuclei imports are best-effort mappings with CWEs derived from template metadata and local mappings, review results carefully.");
  }

  public async _parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const raw = await this.loadText(input);
    let findings: NucleiFinding[] = [];
    const trimmed = raw.trim();
    const scanProfile = ctx?.scanProfile ?? this.scannerKey;

    if (trimmed.startsWith("[")) {
      try {
        findings = JSON.parse(trimmed) as NucleiFinding[];
      } catch (e) {
        //If no findings, throw error
        throw new ScannerParsingError("Failed to parse Nuclei JSON report. Invalid JSON.");
      }
    } else {
      findings = []; //if not expected format, can't parse findings
    }

    //If no findings, throw parsing error
    if (findings.length === 0) {
      throw new ScannerParsingError("Failed to parse Nuclei JSON report. Missing findings.");
    }

    const expectedByTest = this.buildExpectedCWEsByTest(data);
    const detectedByTest = new Map<string, Set<number>>();

    //CWE hierarchy helper (is used in lots of areas in Nuclei)
    const addCweWithParents = (testName: string, cweId: number, cwesSet?: Set<number>) => {
      if (!Number.isFinite(cweId) || cweId <= 0) return;

      if (cwesSet) {
        cwesSet.add(cweId);
      }

      const detectedSet = detectedByTest.get(testName)!;
      detectedSet.add(cweId);

      const parentCwes = this.getAncestorCwes(`CWE-${cweId}`);
      for (const parentCwe of parentCwes) {
        const parentId = Number(parentCwe.replace("CWE-", ""));
        if (Number.isFinite(parentId) && parentId > 0) {
          detectedSet.add(parentId);
          if (cwesSet) {
            cwesSet.add(parentId);
          }
        }
      }
    };

    // infer updatedAt from the artifact (latest timestamp)
    let inferredUpdatedAt: number | undefined = undefined;
    let cwes: number[] = [];

    for (const f of findings) {
      const ts = parseEpochFromIsoOrFallback(f.timestamp);
      if (ts != null) {
        inferredUpdatedAt = inferredUpdatedAt == null ? ts : Math.max(inferredUpdatedAt, ts);
      }

      const testName = this.portToTestName(f.port);
      if (!testName) continue;

      if (!detectedByTest.has(testName)) detectedByTest.set(testName, new Set<number>());

      // 1) Prefer CWE IDs embedded in nuclei output
      const cls = f.info?.classification ?? null;
      const cweField = cls ? (cls as any)["cwe-id"] : null;

      let cwesSet = new Set<number>();
      if (Array.isArray(cweField)) {
        for (const rawCwe of cweField) {
          const n = normalizeCweId(rawCwe);
          if (n != null) {
            addCweWithParents(testName, n, cwesSet);
          }
        }
      } else {
        const n = normalizeCweId(cweField);
        if (n != null) {
          addCweWithParents(testName, n, cwesSet);
        }
      }

      //Add to detected
      const detectedSet = detectedByTest.get(testName)!;
      cwes = Array.from(cwesSet);
      for (const cwe of cwes) {
        detectedSet.add(cwe);
      }
    }

    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt ?? this.nowEpoch();

    const testUniverse = (ctx?.expectedTests?.length
        ? ctx.expectedTests
        : Array.from(detectedByTest.keys())
        ).filter((t) => expectedByTest.has(t)); // keep it aligned to framework tests

    const testsOut = Array.from(new Set(testUniverse))
    .sort(this.sortTestNames)
    .map((test) => {
        const expected = expectedByTest.get(test) ?? new Set<number>();
        const detectedAll = detectedByTest.get(test) ?? new Set<number>(); // empty if no findings

        const detectedCWEs = Array.from(detectedAll)
        .filter((c) => expected.has(c))
        .sort((a, b) => a - b);

        const undetectedCWEs = Array.from(expected)
        .filter((c) => !detectedAll.has(c))
        .sort((a, b) => a - b);

        return { test, detectedCWEs, undetectedCWEs, updatedAt };
    });

    const out: MappingOut = {
      [this.scannerKey]: {
        scanProfile,
        tests: testsOut,
      },
    };

    return out;
  }
}