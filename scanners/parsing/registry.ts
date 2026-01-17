type ParserCapability = {
  scannerKey: string; //e.g: "ZAP"
  label: string; //e.g: "OWASP ZAP"
  extensions: string[]; //e.g: [".json"]
};

export const PARSER_CAPABILITIES: ParserCapability[] = [
  {
    scannerKey: "ZAP",
    label: "OWASP ZAP",
    extensions: [".json", ".xml"]
  },
];