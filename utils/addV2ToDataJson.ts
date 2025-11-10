import * as fs from 'fs';
import * as path from 'path';

const addV2TestCaseToDataJson = (testName: string) => {
    const dataJsonPath = path.join(__dirname, '../data.json');

    const testNameForDataJson = testName.replace('-', '_');
    const v1TestName = `${testNameForDataJson}_v1`;
    const v2TestName = `${testNameForDataJson}_v2`;

    // Update data.json
    const dataJsonContent = fs.readFileSync(dataJsonPath, 'utf8');
    const dataJson = JSON.parse(dataJsonContent);

    dataJson.vulnerabilities.forEach((vulnerability: any) => {
        vulnerability.CWEDetails.forEach((cwe: any) => {
            if (cwe.tests.includes(v1TestName)) {
                if (!cwe.tests.includes(v2TestName)) {
                    const v1Index = cwe.tests.indexOf(v1TestName);
                    cwe.tests.splice(v1Index + 1, 0, v2TestName);
                }
            }
        });
    });

    fs.writeFileSync(dataJsonPath, JSON.stringify(dataJson, null, 2));

    console.log(`Successfully added ${v2TestName} to data.json`);
};

const testName = process.argv[2];
if (!testName) {
    console.error('Please provide a test name (e.g., test-91)');
} else {
    addV2TestCaseToDataJson(testName);
}