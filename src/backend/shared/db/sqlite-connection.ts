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
      original_content_preview TEXT
    )
  `);
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
