import { Hono } from "hono";
import type { CountCertificatesUseCase } from "../../application/count-certificates-use-case";
import type { CertificateRepository } from "../../application/interfaces/certificate-repository";

type Dependencies = {
  countCertificatesUseCase: CountCertificatesUseCase;
  certificateRepository: CertificateRepository;
};

export function buildCountCertificatesEndpoint({ countCertificatesUseCase, certificateRepository }: Dependencies): Hono {
  const router = new Hono();

  router.get("/certificates/count", async (c) => {
    const total = await countCertificatesUseCase.execute();
    return c.json({ total });
  });

  router.get("/certificates/latest", async (c) => {
    const cert = await certificateRepository.findLatest();
    if (!cert) {
      return c.json({ id: null }, 404);
    }
    return c.json({ id: cert.id });
  });

  return router;
}
