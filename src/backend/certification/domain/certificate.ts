export type CertificateProps = {
  id: string;
  hash: string;
  timestamp: Date;
  fileName: string | null;
  contentType: string | null;
  originalContentPreview: string | null;
  chainIndex: number;
  previousCertificateDigest: string;
  certificateDigest: string;
  cubepathUnixTimeCheckedAt: Date | null;
  cubepathUnixTimeSourceHash: string | null;
  cubepathStatusCheckedAt: Date | null;
  cubepathStatusSourceHash: string | null;
  storesFileName: boolean;
  storesOriginalContent: boolean;
};

export class Certificate {
  public readonly id: string;
  public readonly hash: string;
  public readonly timestamp: Date;
  public readonly fileName: string | null;
  public readonly contentType: string | null;
  public readonly originalContentPreview: string | null;
  public readonly chainIndex: number;
  public readonly previousCertificateDigest: string;
  public readonly certificateDigest: string;
  public readonly cubepathUnixTimeCheckedAt: Date | null;
  public readonly cubepathUnixTimeSourceHash: string | null;
  public readonly cubepathStatusCheckedAt: Date | null;
  public readonly cubepathStatusSourceHash: string | null;
  public readonly storesFileName: boolean;
  public readonly storesOriginalContent: boolean;

  constructor(props: CertificateProps) {
    if (!props.id) {
      throw new Error("Certificate id is required");
    }

    if (!/^[a-f0-9]{64}$/i.test(props.hash)) {
      throw new Error("Certificate hash must be a valid SHA256 hex string");
    }

    if (!Number.isInteger(props.chainIndex) || props.chainIndex < 0) {
      throw new Error("Certificate chainIndex must be a non-negative integer");
    }

    if (!/^[a-f0-9]{64}$/i.test(props.previousCertificateDigest)) {
      throw new Error("Certificate previousCertificateDigest must be a valid SHA256 hex string");
    }

    if (!/^[a-f0-9]{64}$/i.test(props.certificateDigest)) {
      throw new Error("Certificate certificateDigest must be a valid SHA256 hex string");
    }

    this.id = props.id;
    this.hash = props.hash;
    this.timestamp = new Date(props.timestamp.toISOString());
    this.fileName = props.fileName;
    this.contentType = props.contentType;
    this.originalContentPreview = props.originalContentPreview;
    this.chainIndex = props.chainIndex;
    this.previousCertificateDigest = props.previousCertificateDigest;
    this.certificateDigest = props.certificateDigest;
    this.cubepathUnixTimeCheckedAt = props.cubepathUnixTimeCheckedAt
      ? new Date(props.cubepathUnixTimeCheckedAt.toISOString())
      : null;
    this.cubepathUnixTimeSourceHash = props.cubepathUnixTimeSourceHash;
    this.cubepathStatusCheckedAt = props.cubepathStatusCheckedAt
      ? new Date(props.cubepathStatusCheckedAt.toISOString())
      : null;
    this.cubepathStatusSourceHash = props.cubepathStatusSourceHash;
    this.storesFileName = props.storesFileName;
    this.storesOriginalContent = props.storesOriginalContent;

    Object.freeze(this);
  }
}
