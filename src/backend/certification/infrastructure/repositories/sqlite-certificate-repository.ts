import type { Database } from "bun:sqlite";
import { Certificate } from "../../domain/certificate";
import type { CertificateRepository } from "../../application/interfaces/certificate-repository";
import { getSqliteConnection } from "../../../shared/db/sqlite-connection";

type CertificateRow = {
  id: string;
  hash: string;
  timestamp: string;
  file_name: string | null;
  content_type: string | null;
  original_content_preview: string | null;
};

export class SqliteCertificateRepository implements CertificateRepository {
  constructor(private readonly db: Database = getSqliteConnection()) {}

  async save(certificate: Certificate): Promise<void> {
    this.db
      .query(
        `INSERT OR REPLACE INTO certificates
        (id, hash, timestamp, file_name, content_type, original_content_preview)
        VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        certificate.id,
        certificate.hash,
        certificate.timestamp.toISOString(),
        certificate.fileName,
        certificate.contentType,
        certificate.originalContentPreview
      );
  }

  async findById(id: string): Promise<Certificate | null> {
    const row = this.db
      .query(
        `SELECT id, hash, timestamp, file_name, content_type, original_content_preview
         FROM certificates
         WHERE id = ?`
      )
      .get(id) as CertificateRow | null;

    if (!row) {
      return null;
    }

    return new Certificate({
      id: row.id,
      hash: row.hash,
      timestamp: new Date(row.timestamp),
      fileName: row.file_name,
      contentType: row.content_type,
      originalContentPreview: row.original_content_preview
    });
  }
}
