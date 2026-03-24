import { createHash } from "node:crypto";
import type { HashProvider } from "../../application/interfaces/hash-provider";
import type { Content } from "../../domain/content";

export class NodeCryptoHashProvider implements HashProvider {
  async calculateHash(content: Content): Promise<string> {
    const hash = createHash("sha256");
    hash.update(content.asBytes());
    return hash.digest("hex");
  }
}
