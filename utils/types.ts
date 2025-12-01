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