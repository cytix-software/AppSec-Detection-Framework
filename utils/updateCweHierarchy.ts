import * as fs from "node:fs";
import * as path from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";

const CWE_ZIP_URL = "https://cwe.mitre.org/data/xml/cwec_latest.xml.zip";

type CweId = `CWE-${number}`;

interface BuildOptions {
  allowedViewIds?: string[];
  includeRelationshipsWithoutView?: boolean;
}

interface SimplifiedCweNode {
  parents: CweId[];
  ancestors: CweId[];
}

type SimplifiedCweHierarchy = Record<CweId, SimplifiedCweNode>;

async function confirmDownload(url: string, outputPath: string): Promise<boolean> {
  const rl = createInterface({ input, output });

  try {
    console.log("This script will download the latest CWE XML ZIP from:");
    console.log(`  ${url}`);
    console.log("");
    console.log("It will build a simplified hierarchy file and save it to:");
    console.log(`  ${outputPath}`);
    console.log("");
    console.log("Please verify the URL yourself before continuing if you want.");

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

function extractXmlFromZip(zipBuffer: Buffer): string {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();

  const xmlEntry = entries.find((entry) => {
    return !entry.isDirectory && entry.entryName.toLowerCase().endsWith(".xml");
  });

  if (!xmlEntry) {
    throw new Error("No XML file found inside the downloaded ZIP.");
  }

  return xmlEntry.getData().toString("utf-8");
}

function normalizeCweId(value: string | number): CweId {
  const raw = String(value).trim();
  const match = raw.match(/^CWE-(\d+)$/i) ?? raw.match(/^(\d+)$/);

  if (!match) {
    throw new Error(`Invalid CWE ID: ${value}`);
  }

  return `CWE-${Number(match[1])}` as CweId;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function cweNumeric(cweId: CweId): number {
  return Number(cweId.replace(/^CWE-/, ""));
}

function sortedCwes(values: Iterable<CweId>): CweId[] {
  return [...values].sort((a, b) => cweNumeric(a) - cweNumeric(b));
}

function shouldIncludeRelationship(
  viewId: string | undefined,
  allowedViewIds?: Set<string>,
  includeRelationshipsWithoutView = true
): boolean {
  if (!allowedViewIds) return true;
  if (!viewId) return includeRelationshipsWithoutView;
  return allowedViewIds.has(String(viewId));
}

function buildSimplifiedHierarchy(
  xml: string,
  options: BuildOptions = {}
): SimplifiedCweHierarchy {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    allowBooleanAttributes: true,
    parseTagValue: false,
    trimValues: true,
  });

  const parsed = parser.parse(xml);

  const catalog = parsed?.Weakness_Catalog;
  const weaknessesRaw = catalog?.Weaknesses?.Weakness;

  if (!weaknessesRaw) {
    throw new Error("Could not find Weakness_Catalog.Weaknesses.Weakness in XML.");
  }

  const weaknesses = toArray(weaknessesRaw);

  const allowedViewIds = options.allowedViewIds
    ? new Set(options.allowedViewIds)
    : undefined;

  const includeRelationshipsWithoutView =
    options.includeRelationshipsWithoutView ?? true;

  const directParents = new Map<CweId, Set<CweId>>();

  for (const weakness of weaknesses) {
    const currentId = normalizeCweId(weakness.ID);

    if (!directParents.has(currentId)) {
      directParents.set(currentId, new Set());
    }

    const relatedRaw = weakness?.Related_Weaknesses?.Related_Weakness;
    const relatedList = toArray(relatedRaw);

    for (const rel of relatedList) {
      if (!rel) continue;

      const nature = rel.Nature;
      const relatedIdRaw = rel.CWE_ID;
      const viewId = rel.View_ID ? String(rel.View_ID) : undefined;

      if (nature !== "ChildOf") continue;
      if (!relatedIdRaw) continue;
      if (!shouldIncludeRelationship(viewId, allowedViewIds, includeRelationshipsWithoutView)) {
        continue;
      }

      const parentId = normalizeCweId(relatedIdRaw);

      directParents.get(currentId)!.add(parentId);

      if (!directParents.has(parentId)) {
        directParents.set(parentId, new Set());
      }
    }
  }

  const ancestorMemo = new Map<CweId, CweId[]>();

  function getAncestors(cweId: CweId, visiting = new Set<CweId>()): CweId[] {
    const memoized = ancestorMemo.get(cweId);
    if (memoized) return memoized;

    if (visiting.has(cweId)) {
      return [];
    }

    visiting.add(cweId);

    const seen = new Set<CweId>();
    const parents = directParents.get(cweId) ?? new Set<CweId>();

    for (const parent of parents) {
      seen.add(parent);

      for (const ancestor of getAncestors(parent, visiting)) {
        seen.add(ancestor);
      }
    }

    visiting.delete(cweId);

    const result = sortedCwes(seen);
    ancestorMemo.set(cweId, result);
    return result;
  }

  const output: SimplifiedCweHierarchy = {} as SimplifiedCweHierarchy;

  for (const [cweId, parents] of directParents.entries()) {
    output[cweId] = {
      parents: sortedCwes(parents),
      ancestors: getAncestors(cweId),
    };
  }

  return output;
}

async function main(): Promise<void> {
  const outputPath = path.resolve(import.meta.dir, "../cwe-hierarchy.json");

  const confirmed = await confirmDownload(CWE_ZIP_URL, outputPath);
  if (!confirmed) {
    console.log("Cancelled.");
    return;
  }

  console.log("Downloading latest CWE ZIP...");
  const zipBuffer = await downloadZip(CWE_ZIP_URL);

  console.log("Extracting XML...");
  const xml = extractXmlFromZip(zipBuffer);

  console.log("Building simplified hierarchy...");
  const hierarchy = buildSimplifiedHierarchy(xml, {
    allowedViewIds: ["1000", "1003", "699", "700", "2000", "677"], // Views relevant to software developers and pen-testers
    includeRelationshipsWithoutView: true,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(hierarchy, null, 2), "utf-8");

  console.log(`Saved simplified hierarchy to: ${outputPath}`);
  console.log(`Total CWE nodes: ${Object.keys(hierarchy).length}`);
}

main().catch((err) => {
  console.error("Failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});