import type { DataJson, MappingOut } from "../../utils/types";
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

  public async parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const raw = await this.loadText(input);
    const report = JSON.parse(raw) as ZapJsonReport;

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
      }
    }

    const inferredUpdatedAt = this.parseEpochFromIsoOrFallback(report.created) ?? this.nowEpoch();
    const inferredScanProfile = report["@version"] ? `v${report["@version"]}` : this.scannerKey;
    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt;
    const scanProfile = ctx?.scanProfile ?? inferredScanProfile;

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