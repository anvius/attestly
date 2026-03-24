import { describe, expect, it } from "bun:test";
import { Content } from "../../../certification/domain/content";
import { HashCalculatorService } from "../../../certification/domain/services/hash-calculator.service";

describe("Content", () => {
  it("creates TEXT content with string payload", () => {
    const content = Content.fromText("DocCum");

    expect(content.type).toBe("TEXT");
    expect(content.asString()).toBe("DocCum");
  });

  it("creates FILE content with binary payload", () => {
    const content = Content.fromFile(new Uint8Array([1, 2, 3]), "application/octet-stream", "file.bin");

    expect(content.type).toBe("FILE");
    expect(content.byteLength).toBe(3);
  });

  it("rejects empty text", () => {
    expect(() => Content.fromText("   ")).toThrow("Text content cannot be empty");
  });

  it("rejects empty file bytes", () => {
    expect(() => Content.fromFile(new Uint8Array(0), "text/plain", "empty.txt")).toThrow(
      "File content cannot be empty",
    );
  });
});

describe("HashCalculatorService", () => {
  it("computes deterministic SHA256 for text content", async () => {
    const content = Content.fromText("hello world");
    const hash = await HashCalculatorService.calculateHash(content);

    expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
  });

  it("matches hash for equivalent text and bytes", async () => {
    const textContent = Content.fromText("abc");
    const fileContent = Content.fromFile(new TextEncoder().encode("abc"), "text/plain", "abc.txt");

    const textHash = await HashCalculatorService.calculateHash(textContent);
    const fileHash = await HashCalculatorService.calculateHash(fileContent);

    expect(textHash).toBe(fileHash);
  });
});
