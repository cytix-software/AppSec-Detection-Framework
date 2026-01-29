import type { DataJson, MappingOut } from "../../utils/types";
import { ScannerParsingError } from "../errors/ScannerParsingError";
import { BaseScannerParser, type ParserInput, type ParseContext } from "./parser";

type SemgrepJsonReport = {
  version?: string; //e.g. "1.149.0"
  results?: Array<{
    check_id?: string;
    path?: string; //e.g. ".../tests/test-47/v1/index.php"
    extra?: {
      metadata?: {
        //Semgrep JSON typically stores CWEs as a string with IDs and descriptions
        cwe?: Array<string>;
      };
    };
  }>;
};

//Convert CWEs from string: "CWE-79: Cross-site Scripting (XSS)" -> 79
function normalizeCweId(cweStr: string): number | null {
  const m = String(cweStr).match(/\bCWE-(\d+)\b/i);
  if (!m) return null;
  const n = Number(m[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

//Converts test dir from: /tests/test-47/v1/index.php  -> test_47_v1
function pathToTestName(pathLike?: string): string | null {
  if (!pathLike) return null;

  //Normalise Windows paths
  const p = String(pathLike).replaceAll("\\", "/");

  const m = p.match(/\/tests\/test-(\d+)\/(v\d+)(\/|$)/i);
  if (!m) return null;

  const [, testNum, variant] = m;
  return `test_${testNum}_${variant}`;
}

export class SemgrepJsonParser extends BaseScannerParser {
  constructor() {
    super("Semgrep");
  }

  public async parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const raw = await this.loadText(input);
    let report;
    try {
        report = JSON.parse(raw) as SemgrepJsonReport;
    } catch (e) { //throw our general parse error if JSON parse failed
        throw new ScannerParsingError("Failed to parse Semgrep JSON report. Invalid JSON.");
    }

    const expectedByTest = this.buildExpectedCWEsByTest(data);
    const detectedByTest = new Map<string, Set<number>>();

    //Find detected CWEs by test
    for (const r of report.results ?? []) {
      const testName = pathToTestName(r.path);
      if (!testName) continue;

      if (!detectedByTest.has(testName)) detectedByTest.set(testName, new Set<number>());

      const cweStrings = r.extra?.metadata?.cwe ?? [];
      for (const cweStr of cweStrings) {
        const cweId = normalizeCweId(cweStr);
        if (!cweId) continue;
        detectedByTest.get(testName)!.add(cweId);
      }
    }

    //If no findings, throw error
    if (detectedByTest.size === 0) {
      throw new ScannerParsingError("Failed to parse Semgrep JSON report. Missing findings.");
    }

    const inferredUpdatedAt = this.nowEpoch(); //semgrep json doesn't include a generated/created timestamp by default
    const inferredScanProfile = report.version ? `v${report.version}` : this.scannerKey;
    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt;
    const scanProfile = ctx?.scanProfile ?? inferredScanProfile;

    const testUniverse = (ctx?.expectedTests?.length
      ? ctx.expectedTests
      : Array.from(detectedByTest.keys())
    ).filter((t) => expectedByTest.has(t)); //keep it aligned to expected framework tests where possible (may have tests that detected nothing)

    const testsOut = Array.from(new Set(testUniverse))
      .sort(this.sortTestNames)
      .map((test) => {
        const expected = expectedByTest.get(test) ?? new Set<number>();
        const detectedAll = detectedByTest.get(test) ?? new Set<number>(); //empty if no findings

        //only count detections that match expected CWEs for this test
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

    this.lastResult = out;
    return out;
  }
}