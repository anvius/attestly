import { Hono } from "hono";
import type { CertifyContentUseCase } from "../../application/certify-content-use-case";
import { Content } from "../../domain/content";

type Dependencies = {
  certifyContentUseCase: CertifyContentUseCase;
};

function mapCertificateToDto(certificate: {
  id: string;
  hash: string;
  timestamp: Date;
  fileName: string | null;
  contentType: string | null;
  originalContentPreview: string | null;
}) {
  return {
    id: certificate.id,
    hash: certificate.hash,
    timestamp: certificate.timestamp.toISOString(),
    fileName: certificate.fileName,
    contentType: certificate.contentType,
    originalContentPreview: certificate.originalContentPreview
  };
}

export function buildCertifyController({ certifyContentUseCase }: Dependencies): Hono {
  const router = new Hono();

  router.post("/certify", async (c) => {
    const body = await c.req.parseBody();
    const text = body.text;
    const file = body.file;

    try {
      let content: Content;

      if (typeof text === "string" && text.trim().length > 0) {
        content = Content.fromText(text);
      } else if (file instanceof File) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        content = Content.fromFile(bytes, file.type || "application/octet-stream", file.name || null);
      } else {
        return c.json({ error: "Either text or file must be provided" }, 400);
      }

      const certificate = await certifyContentUseCase.execute({ content, timestamp: new Date() });
      return c.json(mapCertificateToDto(certificate), 201);
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to certify content" },
        400
      );
    }
  });

  return router;
}
