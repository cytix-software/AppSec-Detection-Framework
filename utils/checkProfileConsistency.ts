import { Data } from './types';
import fs from 'fs';
import yaml from 'js-yaml';

interface DockerService {
    profiles?: string[];
}

interface DockerCompose {
    services: Record<string, DockerService>;
}

function loadData(): Data {
    const data = fs.readFileSync('data.json', 'utf8');
    return JSON.parse(data);
}

function loadDockerCompose(): DockerCompose {
    const dockerCompose = fs.readFileSync('docker-compose.yml', 'utf8');
    return yaml.load(dockerCompose) as DockerCompose;
}

function extractCweFromProfile(profile: string): number | null {
    const match = profile.match(/^cwe-(\d+)$/i);
    return match ? parseInt(match[1], 10) : null;
}

function extractOwaspFromProfile(profile: string): string | null {
    const match = profile.match(/^a\d{2}:\d{4}$/i);
    return match ? match[0].toLowerCase() : null;
}

function findCweInData(cweId: number, data: Data): boolean {
    return data.vulnerabilities.some(vuln => 
        vuln.CWEDetails.some(cwe => cwe.id === cweId)
    );
}

function findTestInData(testName: string, data: Data): boolean {
    return data.vulnerabilities.some(vuln => 
        vuln.CWEDetails.some(cwe => cwe.tests.includes(testName))
    );
}

function getOwaspForTest(testName: string, data: Data): string[] {
    const owaspCategories = new Set<string>();
    
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            if (cwe.tests.includes(testName)) {
                owaspCategories.add(vuln.OWASP.toLowerCase());
            }
        }
    }
    
    return Array.from(owaspCategories);
}

function getCwesForTest(testName: string, data: Data): number[] {
    const cweIds = new Set<number>();
    
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            if (cwe.tests.includes(testName)) {
                cweIds.add(cwe.id);
            }
        }
    }
    
    return Array.from(cweIds);
}

function main() {
    const data = loadData();
    const dockerCompose = loadDockerCompose();
    
    const inconsistencies: string[] = [];
    
    // Check each service in docker-compose.yml
    for (const [serviceName, service] of Object.entries(dockerCompose.services)) {
        if (!service.profiles) continue;
        
        // Check if test exists in data.json
        if (!findTestInData(serviceName, data)) {
            inconsistencies.push(`Test "${serviceName}" exists in docker-compose.yml but not in data.json`);
            continue;
        }
        
        // Get expected CWEs and OWASP categories from data.json
        const expectedCwes = getCwesForTest(serviceName, data);
        const expectedOwasp = getOwaspForTest(serviceName, data);
        
        // Check CWE profiles
        const cweProfiles = service.profiles
            .filter(profile => profile.toLowerCase().startsWith('cwe-'))
            .map(profile => extractCweFromProfile(profile))
            .filter((cweId): cweId is number => cweId !== null);
            
        // Check for missing CWEs in docker-compose.yml
        for (const cweId of expectedCwes) {
            const cweProfile = `cwe-${cweId}`;
            if (!service.profiles?.some(p => p.toLowerCase() === cweProfile.toLowerCase())) {
                inconsistencies.push(`CWE-${cweId} is referenced in data.json for "${serviceName}" but not in docker-compose.yml profiles`);
            }
        }
        
        // Check for extra CWEs in docker-compose.yml
        for (const cweId of cweProfiles) {
            if (!expectedCwes.includes(cweId)) {
                inconsistencies.push(`CWE-${cweId} is referenced in docker-compose.yml for "${serviceName}" but not found in data.json`);
            }
        }
        
        // Check OWASP profiles
        const owaspProfiles = service.profiles
            .filter(profile => profile.toLowerCase().match(/^a\d{2}:\d{4}$/))
            .map(profile => extractOwaspFromProfile(profile))
            .filter((owasp): owasp is string => owasp !== null);
            
        // Check for missing OWASP categories in docker-compose.yml
        for (const owasp of expectedOwasp) {
            if (!owaspProfiles.includes(owasp)) {
                inconsistencies.push(`OWASP category "${owasp}" is referenced in data.json for "${serviceName}" but not in docker-compose.yml profiles`);
            }
        }
        
        // Check for extra OWASP categories in docker-compose.yml
        for (const owasp of owaspProfiles) {
            if (!expectedOwasp.includes(owasp)) {
                inconsistencies.push(`OWASP category "${owasp}" is referenced in docker-compose.yml for "${serviceName}" but not found in data.json`);
            }
        }
    }
    
    // Check each test in data.json
    for (const vuln of data.vulnerabilities) {
        for (const cwe of vuln.CWEDetails) {
            for (const test of cwe.tests) {
                const service = dockerCompose.services[test];
                if (!service) {
                    inconsistencies.push(`Test "${test}" exists in data.json but not in docker-compose.yml`);
                }
            }
        }
    }
    
    if (inconsistencies.length === 0) {
        console.log('✅ All profiles and vulnerabilities are consistent between docker-compose.yml and data.json');
    } else {
        console.log('❌ Found inconsistencies between docker-compose.yml and data.json:');
        inconsistencies.forEach(msg => console.log(`  - ${msg}`));
        process.exit(1);
    }
}

if (require.main === module) {
    main();
} 