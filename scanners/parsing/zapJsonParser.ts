import type { DataJson, MappingOut } from "../../utils/types";
import { ScannerParsingError } from "../errors/ScannerParsingError";
import { BaseScannerParser, type ParserInput, type ParseContext } from "./parser";

type ZapJsonReport = {
  "@programName"?: string; //"ZAP"
  "@version"?: string;     //"2.17.0"
  "@generated"?: string;   //"Tue, 13 Jan 2026 15:35:41"
  created?: string;        //"2026-01-13T15:35:41.539910300Z"
  site?: Array<{
    "@port"?: string | number;
    alerts?: Array<{
      cweid?: string | number;
    }>;
  }>;
};

export class ZapJsonParser extends BaseScannerParser {
  constructor() {
    super("ZAP");
  }

  public async _parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const raw = await this.loadText(input);
    let report;
    try {
      report = JSON.parse(raw) as ZapJsonReport;
    } catch (e) { //throw our general parse error if JSON parse failed
      throw new ScannerParsingError("Failed to parse ZAP JSON report. Invalid JSON.");
    }

    const expectedByTest = this.buildExpectedCWEsByTest(data);

    // testName -> set(cweId)
    const detectedByTest = new Map<string, Set<number>>();

    for (const site of report.site ?? []) {
      const port = (site as any)["@port"];
      const testName = this.portToTestName(port);
      if (!testName) continue;

      if (!detectedByTest.has(testName)) detectedByTest.set(testName, new Set<number>());

      for (const alert of site.alerts ?? []) {
        const cweId = Number(alert.cweid);
        if (!Number.isFinite(cweId) || cweId <= 0) continue; // ZAP uses 0 when unmapped
        detectedByTest.get(testName)!.add(cweId);

        //Now try looking at hierarchy to also add parent CWEs, if any:
        const parentCwes = this.getAncestorCwes(`CWE-${cweId}`);
        for (const parentCwe of parentCwes) {
          const parentId = Number(parentCwe.replace("CWE-", ""));
          if (Number.isFinite(parentId) && parentId > 0) {
            detectedByTest.get(testName)!.add(parentId);
          }
        }
      }
    }

    //If no findings, throw error
    if (detectedByTest.size === 0) {
      throw new ScannerParsingError("Failed to parse ZAP JSON report. Missing findings.");
    }

    const inferredUpdatedAt = this.parseEpochFromIsoOrFallback(report.created) ?? this.nowEpoch();
    const inferredScanProfile = report["@version"] ? `v${report["@version"]}` : this.scannerKey;
    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt;
    const scanProfile = ctx?.scanProfile ?? inferredScanProfile;

    //If possible align to expected tests so we only output tests for current batch.
    const testUniverse = (ctx?.expectedTests?.length
        ? ctx.expectedTests
        : null);
    if (!testUniverse) {
      throw new ScannerParsingError("Failed to parse ZAP JSON report. Internal parsing error: no expected tests provided in context.");
    }

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