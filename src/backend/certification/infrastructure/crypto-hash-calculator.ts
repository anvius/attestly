import { createHash } from "node:crypto";
import type { HashCalculator } from "../domain/hash-calculator";
import type { Content } from "../domain/content";

export class CryptoHashCalculator implements HashCalculator {
  async calculateHash(content: Content): Promise<string> {
    const hash = createHash("sha256");
    hash.update(content.asBytes());
    return hash.digest("hex");
  }
}
