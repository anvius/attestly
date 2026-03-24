import { appendFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

type LogLevel = "warn" | "error";

const LOG_DIR = resolve(import.meta.dir, "../../../var/log");
const LOG_FILE = resolve(LOG_DIR, "app.jsonl");

mkdirSync(LOG_DIR, { recursive: true });

function write(level: LogLevel, msg: string, extra?: Record<string, unknown>): void {
  const entry = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    msg,
    ...extra
  });
  console.error(entry);
  appendFileSync(LOG_FILE, entry + "\n");
}

export const logger = {
  warn: (msg: string, extra?: Record<string, unknown>) => write("warn", msg, extra),
  error: (msg: string, extra?: Record<string, unknown>) => write("error", msg, extra)
};
