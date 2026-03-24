import type { Certificate } from "../domain/certificate";
import type { Content } from "../domain/content";
import { CertificateFactory } from "../domain/services/certificate-factory";
import type { CertificateRepository } from "./interfaces/certificate-repository";
import type { HashProvider } from "./interfaces/hash-provider";

type CertifyContentRequest = {
  content: Content;
  timestamp?: Date;
};

export class CertifyContentUseCase {
  constructor(
    private readonly certificateRepository: CertificateRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async execute(request: CertifyContentRequest): Promise<Certificate> {
    const hash = await this.hashProvider.calculateHash(request.content);
    const certificate = CertificateFactory.create(hash, request.content, request.timestamp ?? new Date());

    await this.certificateRepository.save(certificate);
    return certificate;
  }
}
