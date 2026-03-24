import { Database } from "bun:sqlite";

let database: Database | null = null;

function initializeSchema(db: Database): void {
  db.run(`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      hash TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      file_name TEXT,
      content_type TEXT,
      original_content_preview TEXT,
      chain_index INTEGER NOT NULL DEFAULT 0,
      previous_certificate_digest TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
      certificate_digest TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000',
      cubepath_unixtime_checked_at TEXT,
      cubepath_unixtime_source_hash TEXT,
      cubepath_status_checked_at TEXT,
      cubepath_status_source_hash TEXT,
      stores_file_name INTEGER NOT NULL DEFAULT 0,
      stores_original_content INTEGER NOT NULL DEFAULT 0
    )
  `);

  const existingColumns = db
    .query("PRAGMA table_info(certificates)")
    .all() as Array<{ name: string }>;

  const columnSet = new Set(existingColumns.map((column) => column.name));

  const migrations: Array<{ name: string; sql: string }> = [
    {
      name: "chain_index",
      sql: "ALTER TABLE certificates ADD COLUMN chain_index INTEGER NOT NULL DEFAULT 0"
    },
    {
      name: "previous_certificate_digest",
      sql: "ALTER TABLE certificates ADD COLUMN previous_certificate_digest TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000'"
    },
    {
      name: "certificate_digest",
      sql: "ALTER TABLE certificates ADD COLUMN certificate_digest TEXT NOT NULL DEFAULT '0000000000000000000000000000000000000000000000000000000000000000'"
    },
    {
      name: "cubepath_unixtime_checked_at",
      sql: "ALTER TABLE certificates ADD COLUMN cubepath_unixtime_checked_at TEXT"
    },
    {
      name: "cubepath_unixtime_source_hash",
      sql: "ALTER TABLE certificates ADD COLUMN cubepath_unixtime_source_hash TEXT"
    },
    {
      name: "cubepath_status_checked_at",
      sql: "ALTER TABLE certificates ADD COLUMN cubepath_status_checked_at TEXT"
    },
    {
      name: "cubepath_status_source_hash",
      sql: "ALTER TABLE certificates ADD COLUMN cubepath_status_source_hash TEXT"
    },
    {
      name: "stores_file_name",
      sql: "ALTER TABLE certificates ADD COLUMN stores_file_name INTEGER NOT NULL DEFAULT 0"
    },
    {
      name: "stores_original_content",
      sql: "ALTER TABLE certificates ADD COLUMN stores_original_content INTEGER NOT NULL DEFAULT 0"
    }
  ];

  for (const migration of migrations) {
    if (!columnSet.has(migration.name)) {
      db.run(migration.sql);
    }
  }
}

export function getSqliteConnection(): Database {
  if (database) {
    return database;
  }

  const path = process.env.DB_PATH ?? "doccum.db";
  database = new Database(path);
  initializeSchema(database);
  return database;
}
