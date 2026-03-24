import { createHash } from "node:crypto";

type ChainDigestInput = {
  contentHash: string;
  timestamp: Date;
  chainIndex: number;
  previousCertificateDigest: string;
  cubepathUnixTimeSourceHash: string | null;
  cubepathStatusSourceHash: string | null;
};

export class CertificateChainDigestService {
  static calculate(input: ChainDigestInput): string {
    const payload = [
      input.contentHash,
      input.timestamp.toISOString(),
      String(input.chainIndex),
      input.previousCertificateDigest,
      input.cubepathUnixTimeSourceHash ?? "",
      input.cubepathStatusSourceHash ?? ""
    ].join("|");

    const hash = createHash("sha256");
    hash.update(payload);
    return hash.digest("hex");
  }
}
