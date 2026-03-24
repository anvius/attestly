export type CertificateProps = {
  id: string;
  hash: string;
  timestamp: Date;
  fileName: string | null;
  contentType: string | null;
  originalContentPreview: string | null;
};

export class Certificate {
  public readonly id: string;
  public readonly hash: string;
  public readonly timestamp: Date;
  public readonly fileName: string | null;
  public readonly contentType: string | null;
  public readonly originalContentPreview: string | null;

  constructor(props: CertificateProps) {
    if (!props.id) {
      throw new Error("Certificate id is required");
    }

    if (!/^[a-f0-9]{64}$/i.test(props.hash)) {
      throw new Error("Certificate hash must be a valid SHA256 hex string");
    }

    this.id = props.id;
    this.hash = props.hash;
    this.timestamp = new Date(props.timestamp.toISOString());
    this.fileName = props.fileName;
    this.contentType = props.contentType;
    this.originalContentPreview = props.originalContentPreview;

    Object.freeze(this);
  }
}
