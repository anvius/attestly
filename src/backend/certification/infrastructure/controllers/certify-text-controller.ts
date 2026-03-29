import { Hono } from "hono";
import type { CertifyContentUseCase } from "../../application/certify-content-use-case";
import { Content } from "../../domain/content";

type Dependencies = {
  certifyContentUseCase: CertifyContentUseCase;
};

export function buildCertifyTextController({ certifyContentUseCase }: Dependencies): Hono {
  const router = new Hono();

  router.post("/certify-text", async (c) => {
    try {
      const body = await c.req.json<{ text?: string }>();

      if (!body.text || typeof body.text !== "string") {
        return c.json({ error: "A non-empty text field must be provided" }, 400);
      }

      if (body.text.length > 100_000) {
        return c.json({ error: "Text exceeds maximum length of 100,000 characters" }, 400);
      }

      const content = Content.fromText(body.text);
      const certificate = await certifyContentUseCase.execute({
        content,
        timestamp: new Date()
      });

      return c.json(
        {
          id: certificate.id,
          hash: certificate.hash,
          timestamp: certificate.timestamp.toISOString(),
          fileName: certificate.fileName,
          contentType: certificate.contentType,
          originalContentPreview: certificate.originalContentPreview,
          chainIndex: certificate.chainIndex,
          previousCertificateDigest: certificate.previousCertificateDigest,
          certificateDigest: certificate.certificateDigest,
          cubepathUnixTimeCheckedAt:
            certificate.cubepathUnixTimeCheckedAt?.toISOString() ?? null,
          cubepathUnixTimeSourceHash: certificate.cubepathUnixTimeSourceHash,
          cubepathStatusCheckedAt:
            certificate.cubepathStatusCheckedAt?.toISOString() ?? null,
          cubepathStatusSourceHash: certificate.cubepathStatusSourceHash,
          storesFileName: certificate.storesFileName,
          storesOriginalContent: certificate.storesOriginalContent
        },
        201
      );
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Failed to certify text" },
        400
      );
    }
  });

  return router;
}
