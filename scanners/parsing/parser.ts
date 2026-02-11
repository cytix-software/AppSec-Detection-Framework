import type { DataJson, MappingOut } from "../../utils/types";
import * as fs from "node:fs";
import path from 'path';

export type TestName = string; //e.g: "test_1_v1"
export type DetectedMap = Map<TestName, Set<number>>;

export interface ParseContext {
  scanProfile?: string; //"ZAP", "ZAP v2.16.1", etc.
  author?: string; //name of person initiating the parse
  updatedAt?: number;   //epoch seconds
  expectedTests?: string[]; // e.g. ["test_1_v1","test_1_v2",...]
}

export interface ParserInput {
  artifactPath?: string; //path to report file
  artifactContent?: string; //content of report
}

export interface IScannerParser {
  readonly scannerKey: string;
  lastResult?: MappingOut;

  parse(input: ParserInput, data: DataJson, ctx?: ParseContext): Promise<MappingOut>;
}

const DEFAULT_ARCHIVE_PATH = "./artifacts/import-archives";

/**
 * Base class: stores lastResult and provides save helpers.
 * Derived parsers must implement parse().
 */
export abstract class BaseScannerParser implements IScannerParser {
  public lastResult?: MappingOut;
  private parserHint: string = "Automated parsing is best effort as there is no exact 1-1 mapping, review results carefully.";
  private archivesUsed: string[] = [];

  constructor(public readonly scannerKey: string, public readonly parserHintOverride?: string) {
    if (parserHintOverride) this.parserHint = parserHintOverride;
  }

  public getParserHint(): string {
    return this.parserHint;
  }

  //Method to archive scanner file
  public async archiveScannerFile(input: ParserInput, author: string): Promise<void> {
    //Save artifactContent to DEFAULT_ARCHIVE_PATH with filename as `${scannerKey}_${timestamp}.${ext}`

    //If artifactContent is not provided, try reading artifactPath and set to artifactContent.
    if (!input.artifactContent) {
      if (!input.artifactPath) {
        console.warn("No artifactContent or artifactPath provided for archiving, skipping archive.");
        return;
      }
      input.artifactContent = await this.loadText(input);
    }

    //Now ensure artifactPath is NOT the DEFAULT_ARCHIVE_PATH to avoid archiving already archived files:
    if (input.artifactPath && path.dirname(input.artifactPath) === DEFAULT_ARCHIVE_PATH) return;

    const ext = path.extname(input.artifactPath ?? "report.txt") || ".txt";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `${this.scannerKey}_${timestamp}${ext}`;
    const archivePath = path.join(DEFAULT_ARCHIVE_PATH, fileName);

    //Write file to archives dir
    await fs.promises.mkdir(DEFAULT_ARCHIVE_PATH, { recursive: true });
    await fs.promises.writeFile(archivePath, input.artifactContent, "utf-8");

    //Save relative path of archivePath to archivesUsed for reference in results
    const relative = path.relative(process.cwd(), archivePath);
    const normalized = relative.replace(/\\/g, "/"); //normalize in case of Windows
    this.archivesUsed.push(normalized);

    console.log(`Archived scanner file to ${archivePath}`);
  }

  //To be implemented by each parser with its own logic and return the mapped results
  public abstract _parse(input: ParserInput, data: DataJson, ctx?: ParseContext): Promise<MappingOut>;

  public async parse(input: ParserInput, data: DataJson, ctx?: ParseContext): Promise<MappingOut> {
    let res: MappingOut = await this._parse(input, data, ctx);

    const scannerKey = Object.keys(res)[0]; //select first inner key for main object
    //Add reference to archived file(s) used for this parse under the key 'archivesUsed':
    if (this.archivesUsed.length > 0) {
      //Place 'archivesUsed' inside the scanner object alongside 'scanProfile' etc.:
      res[scannerKey].archivesUsed = this.archivesUsed;
    }

    //Then add a key 'author' with value of ctx.author if provided, else "unknown":
    if (ctx?.author) { //if author isn't null (null represents default/blank)
      console.log("Setting author to:", ctx.author);
      res[scannerKey].author = ctx.author;
    }

    this.lastResult = res;
    return res;
  }

  public async loadText(input: ParserInput): Promise<string> {
    if (typeof input.artifactContent === "string") return input.artifactContent;

    if (input.artifactPath) {
      return await fs.promises.readFile(input.artifactPath, "utf-8");
    }

    throw new Error("ParserInput must include either artifactContent or artifactPath.");
  }

  public nowEpoch(): number {
    return Math.floor(Date.now() / 1000);
  }

  public parseEpochFromIsoOrFallback(iso?: string, fallbackEpoch?: number): number | undefined {
    if (!iso) return fallbackEpoch;
    const ms = Date.parse(iso);
    if (!Number.isFinite(ms)) return fallbackEpoch;
    return Math.floor(ms / 1000);
  }

  //Convert web app port to test name via schema 10000 + (testNum * 10) + variant (1 or 2)
  public portToTestName(portRaw: unknown): string | null {
    const port = typeof portRaw === "string" ? Number(portRaw) : (portRaw as number);
    if (!Number.isFinite(port)) return null;

    const n = port - 10000;
    const variant = n % 10;
    const testNum = Math.floor(n / 10);
    if (testNum > 0 && variant > 0) return `test_${testNum}_v${variant}`;
    else return null;
  }

  //Grab expected CWEs for each existing test app
  public buildExpectedCWEsByTest(data: DataJson): Map<string, Set<number>> {
    const expected = new Map<string, Set<number>>();

    for (const topTenArr of Object.values(data)) {
      if (!Array.isArray(topTenArr)) continue;
      for (const group of topTenArr) {
        for (const cwe of group.CWEDetails ?? []) {
          for (const test of cwe.tests ?? []) {
            if (!expected.has(test)) expected.set(test, new Set<number>());
            expected.get(test)!.add(cwe.id);
          }
        }
      }
    }

    return expected;
  }

  //Sort test names like: test_1_v1, test_2_v1, test_10_v2, etc.
  public sortTestNames(a: string, b: string): number {
    const ma = a.match(/^test_(\d+)_v(\d+)$/);
    const mb = b.match(/^test_(\d+)_v(\d+)$/);
    if (!ma || !mb) return a.localeCompare(b);
    const ta = Number(ma[1]), va = Number(ma[2]);
    const tb = Number(mb[1]), vb = Number(mb[2]);
    return ta !== tb ? ta - tb : va - vb;
  }
}