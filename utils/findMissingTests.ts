import { program } from 'commander';

interface CWEDetail {
    id: number;
    title: string;
    tests: string[];
}

interface Vulnerability {
    OWASP: string;
    CWEDetails: CWEDetail[];
}

interface TestResult {
    test: string;
    detectedCWEs: number[];
    undetectedCWEs: number[];
}

interface ScannerResult {
    scanProfile: string;
    tests: TestResult[];
}

interface Data {
    vulnerabilities: Vulnerability[];
    recordedTests: {
        [key: string]: ScannerResult;
    };
}

interface TestCWEMap {
    [key: string]: Set<string>;
}

interface IncorrectCWEs {
    detected: Set<string>;
    undetected: Set<string>;
}

interface IncorrectCWEMap {
    [key: string]: IncorrectCWEs;
}

async function loadData(filePath: string): Promise<Data> {
    try {
        const file = Bun.file(filePath);
        return await file.json();
    } catch (error) {
        console.error(`Error loading data file: ${error}`);
        process.exit(1);
    }
}

function getAllTestsAndCWEs(data: Data): [Set<string>, TestCWEMap] {
    const allTests = new Set<string>();
    const testCWEs: TestCWEMap = {};

    // Get tests and CWEs from vulnerabilities section
    for (const vuln of data.vulnerabilities) {
        for (const cweDetail of vuln.CWEDetails) {
            const cweId = cweDetail.id.toString();
            for (const test of cweDetail.tests) {
                allTests.add(test);
                if (!testCWEs[test]) {
                    testCWEs[test] = new Set<string>();
                }
                testCWEs[test].add(cweId);
            }
        }
    }

    return [allTests, testCWEs];
}

function analyzeScannerResults(
    scannerName: string,
    scanner: ScannerResult,
    allTests: Set<string>,
    testCWEs: TestCWEMap
): [Set<string>, TestCWEMap, IncorrectCWEMap] {
    const missingTests = new Set<string>();
    const missingCWEs: TestCWEMap = {};
    const incorrectCWEs: IncorrectCWEMap = {};

    // Get tests that the scanner has run
    const scannerTests = new Set(scanner.tests.map(test => test.test));

    // Find missing tests
    for (const test of allTests) {
        if (!scannerTests.has(test)) {
            missingTests.add(test);
        }
    }

    // Find missing and incorrect CWEs for each test
    for (const test of scanner.tests) {
        const testName = test.test;
        if (!testName) continue;

        // Get CWEs that the scanner detected and undetected
        const detectedCWEs = new Set(test.detectedCWEs.map(cwe => cwe.toString()));
        const undetectedCWEs = new Set(test.undetectedCWEs.map(cwe => cwe.toString()));
        const scannerCWEs = new Set([...detectedCWEs, ...undetectedCWEs]);

        // Get expected CWEs for this test
        const expectedCWEs = testCWEs[testName] || new Set<string>();

        // Find missing CWEs (expected but not in scanner results)
        const missing = new Set([...expectedCWEs].filter(cwe => !scannerCWEs.has(cwe)));
        if (missing.size > 0) {
            missingCWEs[testName] = missing;
        }

        // Find incorrect CWEs (in scanner results but not expected)
        const incorrectDetected = new Set([...detectedCWEs].filter(cwe => !expectedCWEs.has(cwe)));
        const incorrectUndetected = new Set([...undetectedCWEs].filter(cwe => !expectedCWEs.has(cwe)));

        if (incorrectDetected.size > 0 || incorrectUndetected.size > 0) {
            incorrectCWEs[testName] = {
                detected: incorrectDetected,
                undetected: incorrectUndetected
            };
        }
    }

    return [missingTests, missingCWEs, incorrectCWEs];
}

function printResults(
    scannerName: string,
    missingTests: Set<string>,
    missingCWEs: TestCWEMap,
    incorrectCWEs: IncorrectCWEMap,
    verbose: boolean = false
): void {
    console.log(`\n=== Analysis for ${scannerName} ===`);

    if (missingTests.size > 0) {
        console.log(`\nMissing Tests (${missingTests.size}):`);
        [...missingTests].sort().forEach(test => {
            console.log(`  - ${test}`);
        });
    } else {
        console.log('\nNo missing tests!');
    }

    if (Object.keys(missingCWEs).length > 0) {
        const totalMissing = Object.values(missingCWEs)
            .reduce((sum, cwes) => sum + cwes.size, 0);
        console.log(`\nMissing CWEs (${totalMissing} total):`);
        Object.entries(missingCWEs).sort().forEach(([test, cwes]) => {
            console.log(`\n  ${test}:`);
            [...cwes].sort().forEach(cwe => {
                console.log(`    - CWE-${cwe}`);
            });
        });
    } else {
        console.log('\nNo missing CWEs!');
    }

    if (Object.keys(incorrectCWEs).length > 0) {
        const totalIncorrect = Object.values(incorrectCWEs)
            .reduce((sum, details) => sum + details.detected.size + details.undetected.size, 0);
        console.log(`\nIncorrect CWE Associations (${totalIncorrect} total):`);
        Object.entries(incorrectCWEs).sort().forEach(([test, details]) => {
            if (details.detected.size > 0 || details.undetected.size > 0) {
                console.log(`\n  ${test}:`);
                if (details.detected.size > 0) {
                    console.log('    Incorrectly Detected:');
                    [...details.detected].sort().forEach(cwe => {
                        console.log(`      - CWE-${cwe}`);
                    });
                }
                if (details.undetected.size > 0) {
                    console.log('    Incorrectly Undetected:');
                    [...details.undetected].sort().forEach(cwe => {
                        console.log(`      - CWE-${cwe}`);
                    });
                }
            }
        });
    } else {
        console.log('\nNo incorrect CWE associations!');
    }
}

async function main(): Promise<void> {
    program
        .option('--file <path>', 'Path to the data.json file', 'data.json')
        .option('-v, --verbose', 'Enable verbose output')
        .parse(process.argv);

    const options = program.opts();

    // Load data
    const data = await loadData(options.file);

    // Get all tests and their CWEs
    const [allTests, testCWEs] = getAllTestsAndCWEs(data);

    // Analyze each scanner
    Object.entries(data.recordedTests).forEach(([scannerName, scanner]) => {
        const [missingTests, missingCWEs, incorrectCWEs] = analyzeScannerResults(
            scannerName,
            scanner,
            allTests,
            testCWEs
        );
        printResults(scannerName, missingTests, missingCWEs, incorrectCWEs, options.verbose);
    });
}

if (import.meta.main) {
    main();
} 