import { createHash } from "node:crypto";
import type {
  ExternalTimeEvidence,
  TimeEvidenceCollector
} from "../domain/time-evidence-collector";

const CUBEPATH_UNIXTIME_URL = "https://cubepath.com/unixtime-converter";
const CUBEPATH_STATUS_URL = "https://cubepath.com/status";

async function fetchAndHash(url: string): Promise<{ checkedAt: Date; sourceHash: string } | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const body = await response.text();
    const hash = createHash("sha256").update(body).digest("hex");

    return {
      checkedAt: new Date(),
      sourceHash: hash
    };
  } catch {
    return null;
  }
}

export class CubepathEvidenceCollector implements TimeEvidenceCollector {
  async collectEvidence(): Promise<ExternalTimeEvidence> {
    const [unixtime, status] = await Promise.all([
      fetchAndHash(CUBEPATH_UNIXTIME_URL),
      fetchAndHash(CUBEPATH_STATUS_URL)
    ]);

    return {
      cubepathUnixTimeCheckedAt: unixtime?.checkedAt ?? null,
      cubepathUnixTimeSourceHash: unixtime?.sourceHash ?? null,
      cubepathStatusCheckedAt: status?.checkedAt ?? null,
      cubepathStatusSourceHash: status?.sourceHash ?? null
    };
  }
}
