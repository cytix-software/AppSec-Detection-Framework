import { readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';

async function mergeResults() {
  const resultsDir = path.resolve(__dirname, '../../results');
  const outputDir = path.resolve(__dirname, '../src/assets');
  const recordedTests = {};

  try {
    const files = await readdir(resultsDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(resultsDir, file);
        const fileContent = await readFile(filePath, 'utf8');
        const scannerResults = JSON.parse(fileContent);
        // Merge individual scanner objects (e.g., {"nuclei": {...}}) into recordedTests
        Object.assign(recordedTests, scannerResults);
      }
    }

    // Wrap the aggregated data into the expected format
    const finalOutput = {
      recordedTests: recordedTests
    };

    const outputFile = path.join(outputDir, 'results.json');
    await writeFile(outputFile, JSON.stringify(finalOutput, null, 2));

    console.log(`✅ Successfully aggregated ${Object.keys(recordedTests).length} scanner results into ${outputFile}`);
  } catch (error) {
    console.error('Error during data aggregation:', error);
    process.exit(1);
  }
}

mergeResults();