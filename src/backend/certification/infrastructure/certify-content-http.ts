import { Hono } from "hono";
import type { CertifyContent } from "../application/certify-content";
import { Content } from "../domain/content";

type Dependencies = {
  certifyContent: CertifyContent;
  maxUploadBytes?: number;
};

function mapCertificateToDto(certificate: {
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
}) {
  return {
    id: certificate.id,
    hash: certificate.hash,
    timestamp: certificate.timestamp.toISOString(),
    fileName: certificate.fileName,
    contentType: certificate.contentType,
    originalContentPreview: certificate.originalContentPreview,
    chainIndex: certificate.chainIndex,
    previousCertificateDigest: certificate.previousCertificateDigest,
    certificateDigest: certificate.certificateDigest,
    cubepathUnixTimeCheckedAt: certificate.cubepathUnixTimeCheckedAt?.toISOString() ?? null,
    cubepathUnixTimeSourceHash: certificate.cubepathUnixTimeSourceHash,
    cubepathStatusCheckedAt: certificate.cubepathStatusCheckedAt?.toISOString() ?? null,
    cubepathStatusSourceHash: certificate.cubepathStatusSourceHash,
    storesFileName: certificate.storesFileName,
    storesOriginalContent: certificate.storesOriginalContent
  };
}

export function createCertifyContentEndpoint({ certifyContent, maxUploadBytes = 25 * 1024 * 1024 }: Dependencies): Hono {
  const router = new Hono();

  router.post("/certify", async (c) => {
    const body = await c.req.parseBody();
    const file = body.file;

    try {
      if (!(file instanceof File)) {
        return c.json({ error: "A single file must be provided" }, 400);
      }

      if (file.size > maxUploadBytes) {
        return c.json({ error: `File size exceeds limit of ${maxUploadBytes} bytes` }, 400);
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      const content = Content.fromFile(bytes, file.type || "application/octet-stream", file.name || null);

      const certificate = await certifyContent.execute({ content, timestamp: new Date() });

      return c.json(mapCertificateToDto(certificate), 201);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Certification failed" },
        500
      );
    }
  });

  return router;
}
