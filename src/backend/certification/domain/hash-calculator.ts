import type { Content } from "./content";

export interface HashCalculator {
  calculateHash(content: Content): Promise<string>;
}
