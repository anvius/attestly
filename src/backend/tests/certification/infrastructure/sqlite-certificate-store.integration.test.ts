import { beforeEach, describe, expect, it } from "bun:test";
import { Database } from "bun:sqlite";
import { Content } from "../../../certification/domain/content";
import { createCertificate } from "../../../certification/domain/create-certificate";
import { SqliteCertificateStore } from "../../../certification/infrastructure/sqlite-certificate-store";

describe("SqliteCertificateStore", () => {
  let db: Database;
  let store: SqliteCertificateStore;

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
    store = new SqliteCertificateStore(db);
  });

  it("saves and retrieves certificate", async () => {
    const certificate = createCertificate(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      Content.fromFile(new TextEncoder().encode("store-test"), "text/plain", "store-test.txt"),
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

    await store.save(certificate);
    const loaded = await store.findById(certificate.id);

    expect(loaded?.id).toBe(certificate.id);
    expect(loaded?.hash).toBe(certificate.hash);
    expect(loaded?.chainIndex).toBe(0);

    const latest = await store.findLatest();
    expect(latest?.id).toBe(certificate.id);
  });
});
