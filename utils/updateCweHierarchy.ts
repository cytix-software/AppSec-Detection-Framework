import * as fs from "node:fs";
import * as path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import AdmZip from "adm-zip";

const CWE_ZIP_URL = "https://cwe.mitre.org/data/xml/cwec_latest.xml.zip";

async function confirmDownload(url: string, outputPath: string): Promise<boolean> {
  const rl = createInterface({ input, output });

  try {
    console.log("This script will download the latest CWE XML ZIP from:");
    console.log(`  ${url}`);
    console.log("");
    console.log("It will extract the XML file and save it to:");
    console.log(`  ${outputPath}`);
    console.log("");
    console.log("Please verify the URL yourself if you want before continuing.");

    const answer = await rl.question("Continue? [y/N]: ");
    const normalized = answer.trim().toLowerCase();

    return normalized === "y" || normalized === "yes";
  } finally {
    rl.close();
  }
}

async function downloadZip(url: string): Promise<Buffer> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download ZIP: HTTP ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function extractXmlFromZip(zipBuffer: Buffer): Buffer {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();

  const xmlEntry = entries.find((entry) => {
    const name = entry.entryName.toLowerCase();
    return !entry.isDirectory && name.endsWith(".xml");
  });

  if (!xmlEntry) {
    throw new Error("No XML file found inside the downloaded CWE ZIP.");
  }

  const data = xmlEntry.getData();

  if (!data || data.length === 0) {
    throw new Error(`Extracted XML entry "${xmlEntry.entryName}" was empty.`);
  }

  return data;
}

async function main(): Promise<void> {
  const outputPath = path.resolve(__dirname, "../cwec_data.xml");

  const confirmed = await confirmDownload(CWE_ZIP_URL, outputPath);
  if (!confirmed) {
    console.log("Download cancelled.");
    return;
  }

  console.log("Downloading CWE ZIP...");
  const zipBuffer = await downloadZip(CWE_ZIP_URL);

  console.log("Extracting XML...");
  const xmlBuffer = extractXmlFromZip(zipBuffer);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, xmlBuffer);

  console.log(`Saved extracted XML to: ${outputPath}`);
}

main().catch((err) => {
  console.error("Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});