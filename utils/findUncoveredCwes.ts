import { program } from 'commander';
import { loadData } from './findMissingTests';
import { Data, CweDetails, Vulnerability } from './types';

function getAllCwes(data: Data): Map<number, string> {
    const cweMap = new Map<number, string>();
    
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            // Skip CWEs that are OWASP Top Ten categories
            if (!cwe.title.includes('OWASP Top Ten')) {
                cweMap.set(cwe.id, cwe.title);
            }
        }
    }
    
    return cweMap;
}

function findUncoveredCwes(data: Data, verbose = false, simplified = false): void {
    const cweMap = getAllCwes(data);
    
    // Get all CWEs that have tests
    const cwesWithTests = new Set<number>();
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            // Skip OWASP Top Ten categories when counting tests
            if (!cwe.title.includes('OWASP Top Ten') && cwe.tests.length > 0) {
                cwesWithTests.add(cwe.id);
            }
        }
    }
    
    // Find CWEs without tests
    const uncoveredCwes = new Set<number>();
    for (const [cweId] of cweMap) {
        if (!cwesWithTests.has(cweId)) {
            uncoveredCwes.add(cweId);
        }
    }
    
    if (simplified) {
        console.log('\nCWEs without tests:');
        console.log('----------------------------------------');
        for (const cwe of Array.from(uncoveredCwes).sort((a, b) => a - b)) {
            console.log(`${cwe}: ${cweMap.get(cwe)}`);
        }
        return;
    }
    
    if (verbose) {
        console.log('\nAnalyzing CWEs without tests');
        console.log('----------------------------------------');
        console.log(`Total CWEs (excluding OWASP Top Ten categories): ${cweMap.size}`);
        console.log(`CWEs with tests: ${cwesWithTests.size}`);
        console.log(`CWEs without tests: ${uncoveredCwes.size}`);
        console.log('\nCWEs without tests:');
        console.log('----------------------------------------');
        
        for (const cwe of Array.from(uncoveredCwes).sort((a, b) => a - b)) {
            console.log(`CWE-${cwe}: ${cweMap.get(cwe)}`);
            
            // Find which vulnerabilities this CWE is associated with
            const vulnerabilities = new Set<string>();
            for (const vuln of data.vulnerabilities) {
                for (const cweDetail of vuln.CWEDetails) {
                    if (cweDetail.id === cwe) {
                        vulnerabilities.add(vuln.OWASP);
                    }
                }
            }
            
            console.log('Associated with vulnerabilities:');
            for (const vuln of Array.from(vulnerabilities).sort()) {
                console.log(`  - ${vuln}`);
            }
            console.log('');
        }
    } else {
        console.log(`\nCWEs without tests: ${uncoveredCwes.size}`);
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
    
    const data = await loadData();
    findUncoveredCwes(data, verbose, simplified);
}

if (require.main === module) {
    main().catch(error => {
        console.error('Error:', error);
        process.exit(1);
    });
} 