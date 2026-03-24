import { describe, expect, it } from "bun:test";
import { Content } from "../../../certification/domain/content";
import { NodeCryptoHashProvider } from "../../../certification/infrastructure/providers/node-crypto-hash-provider";

describe("NodeCryptoHashProvider", () => {
  it("calculates correct SHA256 hash", async () => {
    const provider = new NodeCryptoHashProvider();
    const hash = await provider.calculateHash(Content.fromFile(new TextEncoder().encode("hello world"), "text/plain", null));

    expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });
});
