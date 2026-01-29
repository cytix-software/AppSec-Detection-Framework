export class ScannerParsingError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(
    message = "Error parsing scanner report.",
    options?: { cause?: unknown }
  ) {
    super(message);
    this.name = "ScannerParsingError";
    this.code = "SCANNER_PARSING_ERROR";
    this.status = 400;

    if (options?.cause) {
      (this as any).cause = options.cause;
    }
  }
}