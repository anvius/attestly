import type { Certificate } from "../domain/certificate";
import type { Content } from "../domain/content";
import { createCertificate } from "../domain/create-certificate";
import type { CertificateStore } from "../domain/certificate-store";
import type { TimeEvidenceCollector } from "../domain/time-evidence-collector";
import type { HashCalculator } from "../domain/hash-calculator";

type CertifyContentRequest = {
  content: Content;
  timestamp?: Date;
};

export class CertifyContent {
  private static readonly GENESIS_DIGEST =
    "0000000000000000000000000000000000000000000000000000000000000000";

  constructor(
    private readonly certificateStore: CertificateStore,
    private readonly hashCalculator: HashCalculator,
    private readonly timeEvidenceCollector: TimeEvidenceCollector | null = null
  ) {}

  async execute(request: CertifyContentRequest): Promise<Certificate> {
    const hash = await this.hashCalculator.calculateHash(request.content);
    const timestamp = request.timestamp ?? new Date();
    const latestCertificate = await this.certificateStore.findLatest();
    const chainIndex = (latestCertificate?.chainIndex ?? -1) + 1;
    const previousCertificateDigest =
      latestCertificate?.certificateDigest ?? CertifyContent.GENESIS_DIGEST;

    const evidence = this.timeEvidenceCollector
      ? await this.timeEvidenceCollector.collectEvidence()
      : {
          cubepathUnixTimeCheckedAt: null,
          cubepathUnixTimeSourceHash: null,
          cubepathStatusCheckedAt: null,
          cubepathStatusSourceHash: null
        };

    const certificate = createCertificate(hash, request.content, timestamp, {
      chainIndex,
      previousCertificateDigest,
      cubepathUnixTimeCheckedAt: evidence.cubepathUnixTimeCheckedAt,
      cubepathUnixTimeSourceHash: evidence.cubepathUnixTimeSourceHash,
      cubepathStatusCheckedAt: evidence.cubepathStatusCheckedAt,
      cubepathStatusSourceHash: evidence.cubepathStatusSourceHash
    });

    await this.certificateStore.save(certificate);
    return certificate;
  }
}
