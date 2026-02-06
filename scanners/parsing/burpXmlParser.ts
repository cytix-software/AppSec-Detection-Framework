import type { DataJson, MappingOut } from "../../utils/types";
import { BaseScannerParser, type ParserInput, type ParseContext } from "./parser";
import { ScannerParsingError } from "../errors/ScannerParsingError";

function extractAttr(xml: string, tagName: string, attr: string): string | undefined {
  // e.g. <issues burpVersion="2025.12.5" exportTime="Tue Feb 03 16:34:24 GMT 2026">
  const re = new RegExp(`<${tagName}\\b[^>]*\\b${attr}="([^"]*)"`, "i");
  const m = re.exec(xml);
  return m?.[1];
}

export class BurpXmlParser extends BaseScannerParser {
  constructor(scannerKey: string) {
    super(scannerKey);
  }

  public async parse(
    input: ParserInput,
    data: DataJson,
    ctx?: ParseContext
  ): Promise<MappingOut> {
    const xml = await this.loadText(input);

    const expectedByTest = this.buildExpectedCWEsByTest(data);

    // --- infer scanProfile + updatedAt from root, unless ctx overrides ---
    const burpVersion = extractAttr(xml, "issues", "burpVersion");
    const exportTime = extractAttr(xml, "issues", "exportTime");
    const inferredScanProfile = burpVersion ? `v${burpVersion}` : this.scannerKey;
    const inferredUpdatedAt = this.parseEpochFromIsoOrFallback(exportTime) ?? this.nowEpoch();
    const scanProfile = ctx?.scanProfile ?? inferredScanProfile;
    const updatedAt = ctx?.updatedAt ?? inferredUpdatedAt;

    // testName -> set(cweId)
    const detectedByTest = new Map<string, Set<number>>();

    // --- iterate each <issue> ... </issue> ---
    const issueRe = /<issue\b[^>]*>([\s\S]*?)<\/issue>/gi;
    let issueMatch: RegExpExecArray | null;

    while ((issueMatch = issueRe.exec(xml)) !== null) {
      const issueBody = issueMatch[1] ?? "";

      //host value of format: http://localhost:10011
      const hostMatch = /<host\b[^>]*>\s*([\s\S]*?)\s*<\/host>/i.exec(issueBody);
      const hostText = hostMatch?.[1]?.trim();
      if (!hostText) continue;

      const portMatch = /:(\d+)\b/.exec(hostText);
      const port = portMatch ? Number(portMatch[1]) : NaN;

      const testName = this.portToTestName(port);
      if (!testName) continue;

      if (!detectedByTest.has(testName)) detectedByTest.set(testName, new Set<number>());

      //Burp has CWE IDs inside CDATA HTML
      const vulnMatch = /<vulnerabilityClassifications>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/vulnerabilityClassifications>/i.exec(
        issueBody
      );
      const vulnHtml = vulnMatch?.[1] ?? "";

      const cweRe = /\bCWE-(\d+)\b/gi;
      let cweMatch: RegExpExecArray | null;
      while ((cweMatch = cweRe.exec(vulnHtml)) !== null) {
        const cweId = Number(cweMatch[1]);
        if (!Number.isFinite(cweId) || cweId <= 0) continue;
        detectedByTest.get(testName)!.add(cweId);
      }
    }

    //Error handling
    if (detectedByTest.size === 0) {
      throw new ScannerParsingError(
        "Failed to parse Burp XML report. Missing findings."
      );
    }

    const testUniverse = (ctx?.expectedTests?.length
      ? ctx.expectedTests
      : Array.from(detectedByTest.keys())
    ).filter((t) => expectedByTest.has(t)); // keep it aligned to framework tests

    const testsOut = Array.from(new Set(testUniverse))
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

// Specific Burp scan variants (same logic apart from names)
export class BurpLightXmlParser extends BurpXmlParser {
  constructor() {
    super("Burp Suite - Light Scan");
  }
}

export class BurpDeepXmlParser extends BurpXmlParser {
  constructor() {
    super("Burp Suite - Deep Scan");
  }
}
