import type { Certificate } from "../domain/certificate";
import type { Content } from "../domain/content";
import { CertificateFactory } from "../domain/services/certificate-factory";
import type { CertificateRepository } from "./interfaces/certificate-repository";
import type { ExternalTimeEvidenceProvider } from "./interfaces/external-time-evidence-provider";
import type { HashProvider } from "./interfaces/hash-provider";

type CertifyContentRequest = {
  content: Content;
  timestamp?: Date;
};

export class CertifyContentUseCase {
  private static readonly GENESIS_DIGEST =
    "0000000000000000000000000000000000000000000000000000000000000000";

  constructor(
    private readonly certificateRepository: CertificateRepository,
    private readonly hashProvider: HashProvider,
    private readonly externalTimeEvidenceProvider: ExternalTimeEvidenceProvider | null = null
  ) {}

  async execute(request: CertifyContentRequest): Promise<Certificate> {
    const hash = await this.hashProvider.calculateHash(request.content);
    const timestamp = request.timestamp ?? new Date();
    const latestCertificate = await this.certificateRepository.findLatest();
    const chainIndex = (latestCertificate?.chainIndex ?? -1) + 1;
    const previousCertificateDigest =
      latestCertificate?.certificateDigest ?? CertifyContentUseCase.GENESIS_DIGEST;

    const evidence = this.externalTimeEvidenceProvider
      ? await this.externalTimeEvidenceProvider.collectEvidence()
      : {
          cubepathUnixTimeCheckedAt: null,
          cubepathUnixTimeSourceHash: null,
          cubepathStatusCheckedAt: null,
          cubepathStatusSourceHash: null
        };

    const certificate = CertificateFactory.create(hash, request.content, timestamp, {
      chainIndex,
      previousCertificateDigest,
      cubepathUnixTimeCheckedAt: evidence.cubepathUnixTimeCheckedAt,
      cubepathUnixTimeSourceHash: evidence.cubepathUnixTimeSourceHash,
      cubepathStatusCheckedAt: evidence.cubepathStatusCheckedAt,
      cubepathStatusSourceHash: evidence.cubepathStatusSourceHash
    });

    await this.certificateRepository.save(certificate);
    return certificate;
  }
}
