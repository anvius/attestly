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
  chain_index: number;
  previous_certificate_digest: string;
  certificate_digest: string;
  cubepath_unixtime_checked_at: string | null;
  cubepath_unixtime_source_hash: string | null;
  cubepath_status_checked_at: string | null;
  cubepath_status_source_hash: string | null;
  stores_file_name: number;
  stores_original_content: number;
};

export class SqliteCertificateRepository implements CertificateRepository {
  constructor(private readonly db: Database = getSqliteConnection()) {}

  async save(certificate: Certificate): Promise<void> {
    this.db
      .query(
        `INSERT OR REPLACE INTO certificates
        (
          id,
          hash,
          timestamp,
          file_name,
          content_type,
          original_content_preview,
          chain_index,
          previous_certificate_digest,
          certificate_digest,
          cubepath_unixtime_checked_at,
          cubepath_unixtime_source_hash,
          cubepath_status_checked_at,
          cubepath_status_source_hash,
          stores_file_name,
          stores_original_content
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        certificate.id,
        certificate.hash,
        certificate.timestamp.toISOString(),
        certificate.fileName,
        certificate.contentType,
        certificate.originalContentPreview,
        certificate.chainIndex,
        certificate.previousCertificateDigest,
        certificate.certificateDigest,
        certificate.cubepathUnixTimeCheckedAt?.toISOString() ?? null,
        certificate.cubepathUnixTimeSourceHash,
        certificate.cubepathStatusCheckedAt?.toISOString() ?? null,
        certificate.cubepathStatusSourceHash,
        certificate.storesFileName ? 1 : 0,
        certificate.storesOriginalContent ? 1 : 0
      );
  }

  async findById(id: string): Promise<Certificate | null> {
    const row = this.db
      .query(
        `SELECT id, hash, timestamp, file_name, content_type, original_content_preview
          , chain_index, previous_certificate_digest, certificate_digest
          , cubepath_unixtime_checked_at, cubepath_unixtime_source_hash
          , cubepath_status_checked_at, cubepath_status_source_hash
          , stores_file_name, stores_original_content
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
      originalContentPreview: row.original_content_preview,
      chainIndex: row.chain_index,
      previousCertificateDigest: row.previous_certificate_digest,
      certificateDigest: row.certificate_digest,
      cubepathUnixTimeCheckedAt: row.cubepath_unixtime_checked_at
        ? new Date(row.cubepath_unixtime_checked_at)
        : null,
      cubepathUnixTimeSourceHash: row.cubepath_unixtime_source_hash,
      cubepathStatusCheckedAt: row.cubepath_status_checked_at
        ? new Date(row.cubepath_status_checked_at)
        : null,
      cubepathStatusSourceHash: row.cubepath_status_source_hash,
      storesFileName: Boolean(row.stores_file_name),
      storesOriginalContent: Boolean(row.stores_original_content)
    });
  }

  async findLatest(): Promise<Certificate | null> {
    const row = this.db
      .query(
        `SELECT id, hash, timestamp, file_name, content_type, original_content_preview
         , chain_index, previous_certificate_digest, certificate_digest
         , cubepath_unixtime_checked_at, cubepath_unixtime_source_hash
         , cubepath_status_checked_at, cubepath_status_source_hash
         , stores_file_name, stores_original_content
         FROM certificates
         ORDER BY chain_index DESC
         LIMIT 1`
      )
      .get() as CertificateRow | null;

    if (!row) {
      return null;
    }

    return new Certificate({
      id: row.id,
      hash: row.hash,
      timestamp: new Date(row.timestamp),
      fileName: row.file_name,
      contentType: row.content_type,
      originalContentPreview: row.original_content_preview,
      chainIndex: row.chain_index,
      previousCertificateDigest: row.previous_certificate_digest,
      certificateDigest: row.certificate_digest,
      cubepathUnixTimeCheckedAt: row.cubepath_unixtime_checked_at
        ? new Date(row.cubepath_unixtime_checked_at)
        : null,
      cubepathUnixTimeSourceHash: row.cubepath_unixtime_source_hash,
      cubepathStatusCheckedAt: row.cubepath_status_checked_at
        ? new Date(row.cubepath_status_checked_at)
        : null,
      cubepathStatusSourceHash: row.cubepath_status_source_hash,
      storesFileName: Boolean(row.stores_file_name),
      storesOriginalContent: Boolean(row.stores_original_content)
    });
  }
}
