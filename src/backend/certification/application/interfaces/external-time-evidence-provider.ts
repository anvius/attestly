export type ExternalTimeEvidence = {
  cubepathUnixTimeCheckedAt: Date | null;
  cubepathUnixTimeSourceHash: string | null;
  cubepathStatusCheckedAt: Date | null;
  cubepathStatusSourceHash: string | null;
};

export interface ExternalTimeEvidenceProvider {
  collectEvidence(): Promise<ExternalTimeEvidence>;
}
