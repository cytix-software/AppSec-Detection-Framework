import type { DataJson, MappingOut } from "../../utils/types";
import { BaseScannerParser, type ParserInput, type ParseContext } from "./parser";

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
  private readonly templateIdToCwes: Record<string, number[]> = {};

  constructor() {
    super("Nuclei");
  }

  public async parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const raw = await this.loadText(input);
    let findings: NucleiFinding[] = [];
    const trimmed = raw.trim();
    const scanProfile = ctx?.scanProfile ?? this.scannerKey;

    if (trimmed.startsWith("[")) {
      findings = JSON.parse(trimmed) as NucleiFinding[];
    } else {
      findings = []; //if not expected format, can't parse findings
    }

    const expectedByTest = this.buildExpectedCWEsByTest(data);
    const detectedByTest = new Map<string, Set<number>>();
    // infer updatedAt from the artifact (latest timestamp)
    let inferredUpdatedAt: number | undefined = undefined;

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

      let cwes: number[] = [];
      if (Array.isArray(cweField)) {
        for (const rawCwe of cweField) {
          const n = normalizeCweId(rawCwe);
          if (n != null) cwes.push(n);
        }
      } else {
        const n = normalizeCweId(cweField);
        if (n != null) cwes.push(n);
      }

      // 2) Fallback to local mapping if nuclei didn't provide CWE IDs
      const templateId = f["template-id"] ?? "";
      if (cwes.length === 0 && templateId) {
        const fallback = this.templateIdToCwes[templateId];
        if (Array.isArray(fallback) && fallback.length > 0) {
          cwes = fallback.filter((x) => Number.isFinite(x) && x > 0);
        }
      }

      // Then add CWEs to detected set for this test
      for (const cweId of cwes) {
        detectedByTest.get(testName)!.add(cweId);
      }
    }

    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt ?? this.nowEpoch();

    const testsOut = Array.from(detectedByTest.keys())
      .sort(this.sortTestNames)
      .map((test) => {
        const expected = expectedByTest.get(test) ?? new Set<number>();
        const detectedAll = detectedByTest.get(test) ?? new Set<number>();

        const detectedCWEs = Array.from(detectedAll)
          .filter((c) => expected.has(c))
          .sort((a, b) => a - b);

        const undetectedCWEs = Array.from(expected)
          .filter((c) => !detectedAll.has(c))
          .sort((a, b) => a - b);

        return {
          test,
          detectedCWEs,
          undetectedCWEs,
          updatedAt,
        };
      });

    const out: MappingOut = {
      [this.scannerKey]: {
        scanProfile,
        tests: testsOut,
      },
    };

    this.lastResult = out;
    return out;
  }
}