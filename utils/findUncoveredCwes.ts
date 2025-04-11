import { program } from 'commander';

interface CWEDetail {
    id: number;
    title: string;
    tests: string[];
}

interface Vulnerability {
    OWASP: string;
    group: string;
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

interface CWECoverage {
    id: string;
    title: string;
    OWASP: string;
    group: string;
    tests: string[];
}

interface Results {
    uncovered: CWECoverage[];
    partiallyCovered: CWECoverage[];
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

function findUncoveredCWEs(data: Data): Results {
    const results: Results = {
        uncovered: [],
        partiallyCovered: []
    };

    // Process each vulnerability
    for (const vuln of data.vulnerabilities) {
        for (const cweDetail of vuln.CWEDetails) {
            const coverage: CWECoverage = {
                id: cweDetail.id.toString(),
                title: cweDetail.title,
                OWASP: vuln.OWASP,
                group: vuln.group,
                tests: cweDetail.tests
            };

            // If no tests are associated, it's uncovered
            if (cweDetail.tests.length === 0) {
                results.uncovered.push(coverage);
            }
            // If only one test is associated, it's partially covered
            else if (cweDetail.tests.length === 1) {
                results.partiallyCovered.push(coverage);
            }
        }
    }

    // Sort results by CWE ID
    results.uncovered.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    results.partiallyCovered.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    return results;
}

function printResults(results: Results, verbose: boolean = false): void {
    // Print uncovered CWEs
    console.log(`\n=== CWEs Without Test Coverage ===`);
    console.log(`Found ${results.uncovered.length} uncovered CWEs:\n`);

    for (const cwe of results.uncovered) {
        console.log(`CWE-${cwe.id}: ${cwe.title}`);
        console.log(`  OWASP: ${cwe.OWASP}`);
        console.log(`  Group: ${cwe.group}\n`);
    }

    // Print partially covered CWEs
    console.log(`\n=== CWEs With Limited Coverage ===`);
    console.log(`Found ${results.partiallyCovered.length} CWEs with limited coverage:\n`);

    for (const cwe of results.partiallyCovered) {
        console.log(`CWE-${cwe.id}: ${cwe.title}`);
        console.log(`  Tests: ${cwe.tests.join(', ')}`);
        console.log(`  OWASP: ${cwe.OWASP}`);
        console.log(`  Group: ${cwe.group}\n`);
    }
}

async function main(): Promise<void> {
    program
        .option('--file <path>', 'Path to the data.json file', 'data.json')
        .option('-v, --verbose', 'Enable verbose output')
        .parse(process.argv);

    const options = program.opts();

    // Load and analyze data
    const data = await loadData(options.file);
    const results = findUncoveredCWEs(data);
    printResults(results, options.verbose);
}

if (import.meta.main) {
    main();
} 