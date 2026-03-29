import type { CertificateRepository } from "./interfaces/certificate-repository";

export class CountCertificatesUseCase {
  constructor(private readonly certificateRepository: CertificateRepository) {}

  async execute(): Promise<number> {
    return this.certificateRepository.count();
  }
}
