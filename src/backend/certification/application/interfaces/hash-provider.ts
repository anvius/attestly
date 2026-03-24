import type { Content } from "../../domain/content";

export interface HashProvider {
  calculateHash(content: Content): Promise<string>;
}
