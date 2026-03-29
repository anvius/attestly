import { Hono } from "hono";
import type { VerifyHashUseCase } from "../../application/verify-hash-use-case";
import type { HashProvider } from "../../application/interfaces/hash-provider";
import { Content } from "../../domain/content";

type Dependencies = {
  verifyHashUseCase: VerifyHashUseCase;
  hashProvider: HashProvider;
  maxUploadBytes?: number;
};

export function buildVerifyController({
  verifyHashUseCase,
  hashProvider,
  maxUploadBytes = 25 * 1024 * 1024
}: Dependencies): Hono {
  const router = new Hono();

  router.post("/verify", async (c) => {
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
      const content = Content.fromFile(
        bytes,
        file.type || "application/octet-stream",
        file.name || null
      );
      const hash = await hashProvider.calculateHash(content);
      const certificate = await verifyHashUseCase.execute({ hash });

      return c.json({
        verified: certificate !== null,
        hash,
        certificate: certificate
          ? {
              id: certificate.id,
              hash: certificate.hash,
              timestamp: certificate.timestamp.toISOString(),
              chainIndex: certificate.chainIndex,
              certificateDigest: certificate.certificateDigest
            }
          : null
      });
    } catch (error) {
      return c.json(
        { error: error instanceof Error ? error.message : "Verification failed" },
        400
      );
    }
  });

  return router;
}
