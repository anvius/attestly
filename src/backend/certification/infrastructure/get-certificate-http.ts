import { Hono } from "hono";
import type { GetCertificate } from "../application/get-certificate";

type Dependencies = {
  getCertificate: GetCertificate;
};

export function createGetCertificateEndpoint({ getCertificate }: Dependencies): Hono {
  const router = new Hono();

  router.get("/cert/:id", async (c) => {
    const id = c.req.param("id");
    const certificate = await getCertificate.execute({ id });

    if (!certificate) {
      return c.json({ error: "Certificate not found" }, 404);
    }

    return c.json({
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
    });
  });

  return router;
}
