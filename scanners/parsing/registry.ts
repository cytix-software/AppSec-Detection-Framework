import { BaseScannerParser } from "./parser";

type ParserFactory = () => Promise<{ default?: any } | any>; // dynamic import result
type RegistryEntry = {
  scannerKey: string;     // "ZAP", "nuclei"
  label: string;          // "OWASP ZAP"
  // extensions -> dynamic import + class name (or default export)
  parsers: Record<string, () => Promise<BaseScannerParser>>;
};

export const PARSER_REGISTRY: RegistryEntry[] = [
  {
    scannerKey: "ZAP",
    label: "OWASP ZAP",
    parsers: {
      ".json": async () => {
        const mod = await import("./zapJsonParser");
        return new mod.ZapJsonParser();
      },
      ".xml": async () => {
        const mod = await import("./zapXmlParser");
        return new mod.ZapXmlParser();
      },
    },
  },
  {
    scannerKey: "nuclei",
    label: "Nuclei",
    parsers: {
      ".json": async () => {
        const mod = await import("./nucleiJsonParser");
        return new mod.NucleiJsonParser();
      },
    },
  },
  {
    scannerKey: "Semgrep",
    label: "Semgrep",
    parsers: {
      ".json": async () => {
        const mod = await import("./semgrepJsonParser");
        return new mod.SemgrepJsonParser();
      },
    },
  },
];

// build capabilities for frontend
export type ParserCapability = { scannerKey: string; label: string; extensions: string[] };

export const PARSER_CAPABILITIES: ParserCapability[] = PARSER_REGISTRY.map((e) => ({
  scannerKey: e.scannerKey,
  label: e.label,
  extensions: Object.keys(e.parsers),
}));

export async function findParser(scannerKey: string, ext: string) {
  const keyLower = scannerKey.toLowerCase();
  const entry = PARSER_REGISTRY.find((e) => e.scannerKey.toLowerCase() === keyLower);
  if (!entry) return null;

  const factory = entry.parsers[ext.toLowerCase()];
  if (!factory) return null;

  return await factory();
}