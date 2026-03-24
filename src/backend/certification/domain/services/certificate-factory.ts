import { randomUUID } from "node:crypto";
import { Certificate } from "../certificate";
import type { Content } from "../content";

const TEXT_PREVIEW_LENGTH = 120;

export class CertificateFactory {
  static create(contentHash: string, content: Content, timestamp: Date): Certificate {
    const preview = content.type === "TEXT"
      ? content.asString().slice(0, TEXT_PREVIEW_LENGTH)
      : content.fileName;

    return new Certificate({
      id: randomUUID(),
      hash: contentHash,
      timestamp,
      fileName: content.fileName,
      contentType: content.contentType,
      originalContentPreview: preview
    });
  }
}
