import type { Certificate } from "../../domain/certificate";

export interface CertificateRepository {
  save(certificate: Certificate): Promise<void>;
  findById(id: string): Promise<Certificate | null>;
}
