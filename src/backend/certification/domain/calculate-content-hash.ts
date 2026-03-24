import { createHash } from "node:crypto";
import type { Content } from "./content";

export async function calculateContentHash(content: Content): Promise<string> {
  const hash = createHash("sha256");
  hash.update(content.asBytes());
  return hash.digest("hex");
}
