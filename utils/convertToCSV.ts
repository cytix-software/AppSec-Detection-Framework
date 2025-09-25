import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import path from 'path';
import { ScannerResults } from './types';
import { parse } from 'json2csv';
import minimist from 'minimist';
import { file } from 'bun';
import { dir, log } from 'console';


interface FlattenedResult {
    scannerName: string;
    scanProfile: string;
    test: string;
    detectedCWEs: string; // Converted from number[] to string
    undetectedCWEs: string; // Converted from number[] to string
    updatedAt: number;
}

function convertJsonToCsv(data: ScannerResults) {
    const flattenedData: FlattenedResult[] = [];

    // Iterate over each scanner in the results object
    for (const scannerName in data) {
        if (!data.hasOwnProperty(scannerName)) continue;

        const scannerResults = data[scannerName];
        const { scanProfile, tests } = scannerResults;

        // Iterate over each test result for the current scanner
        tests.forEach(testResult => {
            
            // Flatten the structure and format array fields to strings
            const flatEntry: FlattenedResult = {
                scannerName: scannerName,
                scanProfile: scanProfile,
                test: testResult.test,
                // Convert number arrays to a comma-separated string (e.g., "23,22")
                detectedCWEs: testResult.detectedCWEs.join(', '),
                undetectedCWEs: testResult.undetectedCWEs.join(', '),
                updatedAt: testResult.updatedAt 
            };
            
            flattenedData.push(flatEntry);
        });
    }

    // Define the fields (columns) for the CSV. 
    const fields: (keyof FlattenedResult)[] = [
        'scannerName',
        'test',
        'detectedCWEs',
        'undetectedCWEs',
        'scanProfile',
        'updatedAt'
    ];

    try {
        // Use json2csv to parse the flattened array into a CSV string
        const csv = parse(flattenedData, { fields });
        return csv;
    } catch (err) {
        // Log errors to the console, but return an empty string to avoid crashing upstream logic
        console.error("CSV Conversion Error:", err);
        return "";
    }
}

const args = minimist(process.argv.slice(2));

const helpMessage = `
  Result File JSON to CSV Conversion Utility
  ==========================================
  Converts a scanner's JSON results file (from the results/ directory) into a flat CSV format.
    
  Usage:
    bun run convertToCSV.ts <input_file_path>

  Arguments:
    <input_file_path>  The path to the JSON results file (e.g., ../results/zap.json or results/nuclei.json).

  Example:
    bun run convertToCSV.ts ../results/zap.json
        -> Reads ../results/zap.json and saves the CSV to zap.csv in the current directory.
`;

const inputFilePath = process.argv[2]

// Check if the argument is missing
if (args._.length !== 1) {
  console.log(helpMessage);
  process.exit(1);
}

// break down input file path into its components
const fileName = path.basename(inputFilePath)
const parsedPath = path.parse(fileName)

// get directory name to handle bun run being called from within /utils or from anywhere outisde of /utils
const dirName = path.dirname(inputFilePath)

// construct output file path with the original files name, e.g. zap.json -> zap.csv
const outputFilePath = `${dirName}/${parsedPath.name}.csv`

try {
    // 1. Read the JSON file (synchronously)
    const resultsJson: ScannerResults = JSON.parse(readFileSync(inputFilePath, 'utf8'));

    // 2. Convert the JSON data to the CSV string
    const csvString = convertJsonToCsv(resultsJson);

    if (csvString) {
        // 3. Write the resulting string to a new file
        writeFileSync(outputFilePath, csvString, 'utf-8');
        
        console.log(`✅ Successfully converted JSON to CSV and saved to: ${outputFilePath}`);
    } else {
        console.log('❌ CSV conversion failed or resulted in an empty string.');
    }
} catch (error) {
    console.error(`An error occurred while processing files:`);
    console.error(error);
}
