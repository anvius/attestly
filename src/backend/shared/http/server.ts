import { Hono } from "hono";
import { cors } from "hono/cors";
import { CertifyContentUseCase } from "../../certification/application/certify-content-use-case";
import { GetCertificateUseCase } from "../../certification/application/get-certificate-use-case";
import { buildCertifyController } from "../../certification/infrastructure/controllers/certify-controller";
import { buildGetCertificateController } from "../../certification/infrastructure/controllers/get-certificate-controller";
import { NodeCryptoHashProvider } from "../../certification/infrastructure/providers/node-crypto-hash-provider";
import { SqliteCertificateRepository } from "../../certification/infrastructure/repositories/sqlite-certificate-repository";

export function createServerApp(): Hono {
  const app = new Hono();
  const certificateRepository = new SqliteCertificateRepository();
  const hashProvider = new NodeCryptoHashProvider();
  const certifyContentUseCase = new CertifyContentUseCase(certificateRepository, hashProvider);
  const getCertificateUseCase = new GetCertificateUseCase(certificateRepository);

  app.use("/api/*", cors());

  app.get("/health", (c) => c.json({ status: "ok", service: "doccum-backend" }));
  app.route("/api", buildCertifyController({ certifyContentUseCase }));
  app.route("/api", buildGetCertificateController({ getCertificateUseCase }));

  return app;
}
