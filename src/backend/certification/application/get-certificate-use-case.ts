import type { Certificate } from "../domain/certificate";
import type { CertificateRepository } from "./interfaces/certificate-repository";

type GetCertificateRequest = {
  id: string;
};

export class GetCertificateUseCase {
  constructor(private readonly certificateRepository: CertificateRepository) {}

  async execute(request: GetCertificateRequest): Promise<Certificate | null> {
    return this.certificateRepository.findById(request.id);
  }
}
