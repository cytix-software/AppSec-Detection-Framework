export interface CweDetails {
    id: number;
    title: string;
    tests: string[];
}

export interface Vulnerability {
    OWASP: string;
    CWEDetails: CweDetails[];
    group: string;
}

export interface Data {
    'Top-Ten-2021': Vulnerability[];
    'Top-Ten-2025': Vulnerability[];
    recordedTests: Record<string, {
        scanProfile: string;
        tests: Array<{
            test: string;
            detectedCWEs: number[];
            undetectedCWEs: number[];
            updatedAt: number;
        }>;
    }>;
}

export interface ProcessedData {
    vulnerabilities: Vulnerability[]; // This is the combined list
    recordedTests: Record<string, {
        scanProfile: string;
        tests: Array<{
            test: string;
            detectedCWEs: number[];
            undetectedCWEs: number[];
            updatedAt: number;
        }>;
    }>;
}

export interface ScannerResults {
      scanProfile: string
      tests: RecordedTest[]
}

export interface RecordedTest {
  test: string
  detectedCWEs: number[]
  undetectedCWEs: number[]
  updatedAt: number
}

//Automatic parsing
export type DataJson = Record<
  string,
  Array<{
    OWASP?: string;
    group?: string;
    CWEDetails?: Array<{
      id: number;
      title?: string;
      tests?: string[];
    }>;
  }>
>;

export type MappingOut = {
  [scannerKey: string]: {
    scanProfile: string;
    archivesUsed?: string[]; //relative paths of archived files used for this scanner result
    author?: string; //name of person initiating the parse
    tests: Array<{
      test: string;
      detectedCWEs: number[];
      undetectedCWEs: number[];
      updatedAt: number;
    }>;
  }
};

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

//CWE Hierarchy
export type CweId = `CWE-${number}`;

export interface SimplifiedCweNode {
  parents: CweId[];
  ancestors: CweId[];
}

export type SimplifiedCweHierarchy = Record<CweId, SimplifiedCweNode>;