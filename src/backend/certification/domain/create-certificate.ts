import { randomUUID } from "node:crypto";
import { Certificate } from "./certificate";
import type { Content } from "./content";
import { calculateChainDigest } from "./calculate-chain-digest";

const FILE_NAME_HINT_LENGTH = 5;

type CreateCertificateInput = {
  chainIndex: number;
  previousCertificateDigest: string;
  cubepathUnixTimeCheckedAt: Date | null;
  cubepathUnixTimeSourceHash: string | null;
  cubepathStatusCheckedAt: Date | null;
  cubepathStatusSourceHash: string | null;
};

export function createCertificate(
  contentHash: string,
  content: Content,
  timestamp: Date,
  input: CreateCertificateInput
): Certificate {
  const safeSummary = buildSafeSummary(content);

  const certificateDigest = calculateChainDigest({
    contentHash,
    timestamp,
    chainIndex: input.chainIndex,
    previousCertificateDigest: input.previousCertificateDigest,
    cubepathUnixTimeSourceHash: input.cubepathUnixTimeSourceHash,
    cubepathStatusSourceHash: input.cubepathStatusSourceHash
  });

  return new Certificate({
    id: randomUUID(),
    hash: contentHash,
    timestamp,
    fileName: null,
    contentType: content.contentType,
    originalContentPreview: safeSummary,
    chainIndex: input.chainIndex,
    previousCertificateDigest: input.previousCertificateDigest,
    certificateDigest,
    cubepathUnixTimeCheckedAt: input.cubepathUnixTimeCheckedAt,
    cubepathUnixTimeSourceHash: input.cubepathUnixTimeSourceHash,
    cubepathStatusCheckedAt: input.cubepathStatusCheckedAt,
    cubepathStatusSourceHash: input.cubepathStatusSourceHash,
    storesFileName: false,
    storesOriginalContent: false
  });
}

function buildSafeSummary(content: Content): string {
  if (content.type === "TEXT") {
    return `text input (${content.byteLength} bytes)`;
  }

  const mediaType = content.contentType ?? "application/octet-stream";
  const category = mediaType.startsWith("image/") ? "image" : "document";

  if (!content.fileName) {
    return `${category}: ${mediaType} (${content.byteLength} bytes)`;
  }

  const normalizedName = content.fileName.trim();
  const firstChars = normalizedName.slice(0, FILE_NAME_HINT_LENGTH);
  const fileHint = firstChars.length > 0 ? `${firstChars}\u2026` : "untitled";

  return `${category}: ${fileHint} | ${mediaType} (${content.byteLength} bytes)`;
}
