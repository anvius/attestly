import type { Certificate } from "./certificate";

export interface CertificateStore {
  save(certificate: Certificate): Promise<void>;
  findById(id: string): Promise<Certificate | null>;
  findLatest(): Promise<Certificate | null>;
}
