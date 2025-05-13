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
        console.log('----------------------------------------');
        console.log('Note: CWEs with titles containing "OWASP Top Ten" are excluded as these are category references rather than specific CWEs.');
        console.log('----------------------------------------');
        console.log('\nAnalyzing CWEs without tests');
        console.log('----------------------------------------');
        console.log(`Total CWEs (excluding OWASP Top Ten categories): ${cweMap.size}`);
        console.log(`CWEs with tests: ${cwesWithTests.size}`);
        console.log(`CWEs without tests: ${uncoveredCwes.size}`);
        console.log('\nCWEs without tests by OWASP Category:');
        console.log('----------------------------------------');
        
        // Group uncovered CWEs by OWASP category
        const cwesByCategory = new Map<string, Array<{id: number, title: string}>>();
        const coveredCwesByCategory = new Map<string, number>();
        const totalCwesByCategory = new Map<string, number>();
        
        // Initialize counts for all OWASP categories
        for (const vuln of data.vulnerabilities) {
            coveredCwesByCategory.set(vuln.OWASP, 0);
            totalCwesByCategory.set(vuln.OWASP, 0);
        }
        
        // Count total and covered CWEs for each category
        for (const vuln of data.vulnerabilities) {
            for (const cwe of vuln.CWEDetails) {
                if (!cwe.title.includes('OWASP Top Ten')) {
                    totalCwesByCategory.set(
                        vuln.OWASP,
                        (totalCwesByCategory.get(vuln.OWASP) || 0) + 1
                    );
                    if (cwe.tests.length > 0) {
                        coveredCwesByCategory.set(
                            vuln.OWASP,
                            (coveredCwesByCategory.get(vuln.OWASP) || 0) + 1
                        );
                    }
                }
            }
        }
        
        for (const cwe of Array.from(uncoveredCwes).sort((a, b) => a - b)) {
            // Find which vulnerabilities this CWE is associated with
            for (const vuln of data.vulnerabilities) {
                for (const cweDetail of vuln.CWEDetails) {
                    if (cweDetail.id === cwe) {
                        if (!cwesByCategory.has(vuln.OWASP)) {
                            cwesByCategory.set(vuln.OWASP, []);
                        }
                        cwesByCategory.get(vuln.OWASP)?.push({
                            id: cwe,
                            title: cweMap.get(cwe) || ''
                        });
                    }
                }
            }
        }
        
        // Find categories with complete coverage
        const completeCategories = Array.from(totalCwesByCategory.entries())
            .filter(([category, total]) => {
                const covered = coveredCwesByCategory.get(category) || 0;
                return total > 0 && covered === total;
            })
            .map(([category]) => category)
            .sort();
        
        if (completeCategories.length > 0) {
            console.log('\nOWASP Categories with Complete Coverage:');
            console.log('----------------------------------------');
            for (const category of completeCategories) {
                const total = totalCwesByCategory.get(category) || 0;
                console.log(`${category} (${total} CWEs covered)`);
            }
        }
        
        // Print CWEs grouped by OWASP category
        console.log('\nOWASP Categories with Missing Coverage:');
        console.log('----------------------------------------');
        for (const [category, cwes] of Array.from(cwesByCategory.entries()).sort()) {
            const coveredCount = coveredCwesByCategory.get(category) || 0;
            const totalCount = totalCwesByCategory.get(category) || 0;
            console.log(`\n${category} (${coveredCount}/${totalCount} covered):`);
            console.log('  Missing tests for:');
            for (const cwe of cwes.sort((a, b) => a.id - b.id)) {
                console.log(`    - CWE-${cwe.id}: ${cwe.title}`);
            }
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