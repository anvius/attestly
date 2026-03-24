import type { Certificate } from "../domain/certificate";
import type { CertificateStore } from "../domain/certificate-store";

type GetCertificateRequest = {
  id: string;
};

export class GetCertificate {
  constructor(private readonly certificateStore: CertificateStore) {}

  async execute(request: GetCertificateRequest): Promise<Certificate | null> {
    return this.certificateStore.findById(request.id);
  }
}
