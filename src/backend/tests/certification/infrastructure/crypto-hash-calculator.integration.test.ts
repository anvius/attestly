import { describe, expect, it } from "bun:test";
import { Content } from "../../../certification/domain/content";
import { CryptoHashCalculator } from "../../../certification/infrastructure/crypto-hash-calculator";

describe("CryptoHashCalculator", () => {
  it("calculates correct SHA256 hash", async () => {
    const calculator = new CryptoHashCalculator();
    const hash = await calculator.calculateHash(Content.fromFile(new TextEncoder().encode("hello world"), "text/plain", null));

    expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });
});
