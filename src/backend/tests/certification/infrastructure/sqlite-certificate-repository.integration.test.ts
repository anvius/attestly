import { beforeEach, describe, expect, it } from "bun:test";
import { Database } from "bun:sqlite";
import { Content } from "../../../certification/domain/content";
import { CertificateFactory } from "../../../certification/domain/services/certificate-factory";
import { SqliteCertificateRepository } from "../../../certification/infrastructure/repositories/sqlite-certificate-repository";

describe("SqliteCertificateRepository", () => {
  let db: Database;
  let repository: SqliteCertificateRepository;

  beforeEach(() => {
    db = new Database(":memory:");
    db.run(`
      CREATE TABLE certificates (
        id TEXT PRIMARY KEY,
        hash TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        file_name TEXT,
        content_type TEXT,
        original_content_preview TEXT,
        chain_index INTEGER NOT NULL,
        previous_certificate_digest TEXT NOT NULL,
        certificate_digest TEXT NOT NULL,
        cubepath_unixtime_checked_at TEXT,
        cubepath_unixtime_source_hash TEXT,
        cubepath_status_checked_at TEXT,
        cubepath_status_source_hash TEXT,
        stores_file_name INTEGER NOT NULL,
        stores_original_content INTEGER NOT NULL
      )
    `);
    repository = new SqliteCertificateRepository(db);
  });

  it("saves and retrieves certificate", async () => {
    const certificate = CertificateFactory.create(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      Content.fromFile(new TextEncoder().encode("repo-test"), "text/plain", "repo-test.txt"),
      new Date("2026-03-18T11:00:00.000Z"),
      {
        chainIndex: 0,
        previousCertificateDigest:
          "0000000000000000000000000000000000000000000000000000000000000000",
        cubepathUnixTimeCheckedAt: null,
        cubepathUnixTimeSourceHash: null,
        cubepathStatusCheckedAt: null,
        cubepathStatusSourceHash: null
      }
    );

    await repository.save(certificate);
    const loaded = await repository.findById(certificate.id);

    expect(loaded?.id).toBe(certificate.id);
    expect(loaded?.hash).toBe(certificate.hash);
    expect(loaded?.chainIndex).toBe(0);

    const latest = await repository.findLatest();
    expect(latest?.id).toBe(certificate.id);
  });

  it("findByHash returns matching certificate", async () => {
    const hash = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const certificate = CertificateFactory.create(
      hash,
      Content.fromText("find-by-hash-test"),
      new Date("2026-03-18T11:00:00.000Z"),
      {
        chainIndex: 0,
        previousCertificateDigest:
          "0000000000000000000000000000000000000000000000000000000000000000",
        cubepathUnixTimeCheckedAt: null,
        cubepathUnixTimeSourceHash: null,
        cubepathStatusCheckedAt: null,
        cubepathStatusSourceHash: null
      }
    );

    await repository.save(certificate);
    const found = await repository.findByHash(hash);

    expect(found).not.toBeNull();
    expect(found?.hash).toBe(hash);
  });

  it("findByHash returns null for unknown hash", async () => {
    const found = await repository.findByHash(
      "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
    );
    expect(found).toBeNull();
  });

  it("count returns total number of certificates", async () => {
    expect(await repository.count()).toBe(0);

    const cert1 = CertificateFactory.create(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      Content.fromText("count-test-1"),
      new Date("2026-03-18T11:00:00.000Z"),
      {
        chainIndex: 0,
        previousCertificateDigest:
          "0000000000000000000000000000000000000000000000000000000000000000",
        cubepathUnixTimeCheckedAt: null,
        cubepathUnixTimeSourceHash: null,
        cubepathStatusCheckedAt: null,
        cubepathStatusSourceHash: null
      }
    );

    await repository.save(cert1);
    expect(await repository.count()).toBe(1);

    const cert2 = CertificateFactory.create(
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      Content.fromText("count-test-2"),
      new Date("2026-03-18T11:01:00.000Z"),
      {
        chainIndex: 1,
        previousCertificateDigest: cert1.certificateDigest,
        cubepathUnixTimeCheckedAt: null,
        cubepathUnixTimeSourceHash: null,
        cubepathStatusCheckedAt: null,
        cubepathStatusSourceHash: null
      }
    );

    await repository.save(cert2);
    expect(await repository.count()).toBe(2);
  });
});
