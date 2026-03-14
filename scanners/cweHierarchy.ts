import * as fs from "node:fs";
import { CweId, SimplifiedCweHierarchy } from "../utils/types";

export class CweHierarchy {
  private readonly data: SimplifiedCweHierarchy;

  constructor(data: SimplifiedCweHierarchy) {
    this.data = data;
  }

  public static fromObject(data: SimplifiedCweHierarchy): CweHierarchy {
    return new CweHierarchy(data);
  }

  public static fromJsonFile(filePath: string): CweHierarchy {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as SimplifiedCweHierarchy;
    return new CweHierarchy(parsed);
  }

  public has(cweId: string): boolean {
    const id = this.normalizeCweId(cweId);
    return id in this.data;
  }

  public getParentCwes(cweId: string): CweId[] {
    const id = this.normalizeCweId(cweId);
    return this.data[id]?.parents ?? [];
  }

  public getAncestorCwes(cweId: string, includeSelf = false): CweId[] {
    const id = this.normalizeCweId(cweId);
    const ancestors = this.data[id]?.ancestors ?? [];

    if (!includeSelf) {
      return ancestors;
    }

    return this.uniqueSorted([id, ...ancestors]);
  }

  /**
   * Alias in case you prefer the older naming style.
   */
  public returnParentCwes(cweId: string): CweId[] {
    return this.getParentCwes(cweId);
  }

  /**
   * Alias in case you prefer the older naming style.
   */
  public returnAncestorCwes(cweId: string, includeSelf = false): CweId[] {
    return this.getAncestorCwes(cweId, includeSelf);
  }

  private normalizeCweId(input: string): CweId {
    const raw = String(input).trim();
    const match = raw.match(/^CWE-(\d+)$/i) ?? raw.match(/^(\d+)$/);

    if (!match) {
      throw new Error(`Invalid CWE ID: ${input}`);
    }

    return `CWE-${Number(match[1])}` as CweId;
  }

  private uniqueSorted(values: CweId[]): CweId[] {
    return [...new Set(values)].sort((a, b) => {
      const aNum = Number(a.replace(/^CWE-/, ""));
      const bNum = Number(b.replace(/^CWE-/, ""));
      return aNum - bNum;
    });
  }
}