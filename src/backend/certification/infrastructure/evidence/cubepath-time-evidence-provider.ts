import { createHash } from "node:crypto";
import type {
  ExternalTimeEvidence,
  ExternalTimeEvidenceProvider
} from "../../application/interfaces/external-time-evidence-provider";

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

export class CubepathTimeEvidenceProvider implements ExternalTimeEvidenceProvider {
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
