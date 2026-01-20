import type { DataJson, MappingOut } from "../../utils/types";
import { BaseScannerParser, type ParserInput, type ParseContext } from "./parser";

function extractAttr(xml: string, tagName: string, attr: string): string | undefined {
  // e.g. <OWASPZAPReport version="2.17.0" ...>
  const re = new RegExp(`<${tagName}\\b[^>]*\\b${attr}="([^"]*)"`, "i");
  const m = re.exec(xml);
  return m?.[1];
}

export class ZapXmlParser extends BaseScannerParser {
  constructor() {
    super("ZAP");
  }

  public async parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const xml = await this.loadText(input);

    const expectedByTest = this.buildExpectedCWEsByTest(data);

    // --- infer scanProfile + updatedAt from XML root, unless ctx overrides ---
    const programName = extractAttr(xml, "OWASPZAPReport", "programName") ?? this.scannerKey;
    const version = extractAttr(xml, "OWASPZAPReport", "version");
    const createdIso = extractAttr(xml, "OWASPZAPReport", "created");
    const inferredScanProfile = version ? `v${version}` : programName;
    const inferredUpdatedAt = this.parseEpochFromIsoOrFallback(createdIso) ?? this.nowEpoch();
    const scanProfile = ctx?.scanProfile ?? inferredScanProfile;
    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt;

    // testName -> set(cweId)
    const detectedByTest = new Map<string, Set<number>>();

    // --- iterate each <site ... port="xxxxx" ...> ... </site> ---
    const siteRe = /<site\b([^>]*)>([\s\S]*?)<\/site>/gi;
    let siteMatch: RegExpExecArray | null;

    while ((siteMatch = siteRe.exec(xml)) !== null) {
      const siteAttrs = siteMatch[1] ?? "";
      const siteBody = siteMatch[2] ?? "";

      const portMatch = /\bport="(\d+)"/i.exec(siteAttrs);
      const port = portMatch ? Number(portMatch[1]) : NaN;

      const testName = this.portToTestName(port);
      if (!testName) continue;

      if (!detectedByTest.has(testName)) detectedByTest.set(testName, new Set<number>());

      // Find all <cweid>123</cweid> within this site
      const cweRe = /<cweid>\s*(\d+)\s*<\/cweid>/gi;
      let cweMatch: RegExpExecArray | null;
      while ((cweMatch = cweRe.exec(siteBody)) !== null) {
        const cweId = Number(cweMatch[1]);
        if (!Number.isFinite(cweId) || cweId <= 0) continue;
        detectedByTest.get(testName)!.add(cweId);
      }
    }

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