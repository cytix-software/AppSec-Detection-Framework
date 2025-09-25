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
    vulnerabilities: Vulnerability[];
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