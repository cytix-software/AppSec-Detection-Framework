import { program } from 'commander';
import { loadData } from './findMissingTests';
import { Data, CweDetails, Vulnerability } from './types';

function getAllCwes(data: Data): Map<number, string> {
    const cweMap = new Map<number, string>();
    
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            cweMap.set(cwe.id, cwe.title);
        }
    }
    
    return cweMap;
}

function findUncoveredCwes(data: Data, scannerName: string, verbose = false, simplified = false): void {
    const cweMap = getAllCwes(data);
    const scannerResults = data.recordedTests[scannerName];
    
    if (!scannerResults) {
        console.error(`No results found for scanner: ${scannerName}`);
        return;
    }
    
    // Get all CWEs that have tests
    const cwesWithTests = new Set<number>();
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            if (cwe.tests.length > 0) {
                cwesWithTests.add(cwe.id);
            }
        }
    }
    
    // Get all CWEs detected by the scanner
    const detectedCwes = new Set<number>();
    for (const test of scannerResults.tests) {
        for (const cwe of test.detectedCWEs) {
            detectedCwes.add(cwe);
        }
    }
    
    // Find uncovered CWEs
    const uncoveredCwes = new Set<number>();
    for (const cwe of cwesWithTests) {
        if (!detectedCwes.has(cwe)) {
            uncoveredCwes.add(cwe);
        }
    }
    
    if (simplified) {
        console.log(`\nUncovered CWEs for ${scannerName}:`);
        console.log('----------------------------------------');
        for (const cwe of Array.from(uncoveredCwes).sort((a, b) => a - b)) {
            console.log(`${cwe}: ${cweMap.get(cwe)}`);
        }
        return;
    }
    
    if (verbose) {
        console.log(`\nAnalyzing scanner: ${scannerName}`);
        console.log('----------------------------------------');
        console.log(`Total CWEs with tests: ${cwesWithTests.size}`);
        console.log(`CWEs detected by scanner: ${detectedCwes.size}`);
        console.log(`Uncovered CWEs: ${uncoveredCwes.size}`);
        console.log('\nUncovered CWEs:');
        console.log('----------------------------------------');
        
        for (const cwe of Array.from(uncoveredCwes).sort((a, b) => a - b)) {
            console.log(`CWE-${cwe}: ${cweMap.get(cwe)}`);
            
            // Find which tests demonstrate this CWE
            const testsForCwe = new Set<string>();
            for (const vuln of data.vulnerabilities) {
                for (const cweDetail of vuln.CWEDetails) {
                    if (cweDetail.id === cwe) {
                        for (const test of cweDetail.tests) {
                            testsForCwe.add(test);
                        }
                    }
                }
            }
            
            console.log('Demonstrated by tests:');
            for (const test of Array.from(testsForCwe).sort()) {
                console.log(`  - ${test}`);
            }
            console.log('');
        }
    } else {
        console.log(`\nUncovered CWEs for ${scannerName}: ${uncoveredCwes.size}`);
        console.log('----------------------------------------');
        for (const cwe of Array.from(uncoveredCwes).sort((a, b) => a - b)) {
            console.log(`CWE-${cwe}: ${cweMap.get(cwe)}`);
        }
    }
}

async function main() {
    const args = process.argv.slice(2);
    const verbose = args.includes('-v') || args.includes('--verbose');
    const simplified = args.includes('-s') || args.includes('--simplified');
    const scannerName = args.find(arg => !arg.startsWith('-')) || 'zap_v2.16.0';
    
    const data = await loadData();
    findUncoveredCwes(data, scannerName, verbose, simplified);
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
} 