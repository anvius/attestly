import type { Certificate } from "../domain/certificate";
import type { CertificateRepository } from "./interfaces/certificate-repository";

type VerifyHashRequest = {
  hash: string;
};

export class VerifyHashUseCase {
  constructor(private readonly certificateRepository: CertificateRepository) {}

  async execute(request: VerifyHashRequest): Promise<Certificate | null> {
    if (!/^[a-f0-9]{64}$/i.test(request.hash)) {
      return null;
    }

    return this.certificateRepository.findByHash(request.hash);
  }
}
