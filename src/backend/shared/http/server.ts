import { Hono } from "hono";
import { cors } from "hono/cors";
import { CertifyContentUseCase } from "../../certification/application/certify-content-use-case";
import { CountCertificatesUseCase } from "../../certification/application/count-certificates-use-case";
import { GetCertificateUseCase } from "../../certification/application/get-certificate-use-case";
import { VerifyHashUseCase } from "../../certification/application/verify-hash-use-case";
import { buildCertifyController } from "../../certification/infrastructure/controllers/certify-controller";
import { buildCertifyTextController } from "../../certification/infrastructure/controllers/certify-text-controller";
import { buildCountController } from "../../certification/infrastructure/controllers/count-controller";
import { buildGetCertificateController } from "../../certification/infrastructure/controllers/get-certificate-controller";
import { buildVerifyController } from "../../certification/infrastructure/controllers/verify-controller";
import { CubepathTimeEvidenceProvider } from "../../certification/infrastructure/providers/cubepath-time-evidence-provider";
import { NodeCryptoHashProvider } from "../../certification/infrastructure/providers/node-crypto-hash-provider";
import { SqliteCertificateRepository } from "../../certification/infrastructure/repositories/sqlite-certificate-repository";
import { ContactRequestUseCase } from "../../contact/application/contact-request.use-case";
import type { ContactMessageSender } from "../../contact/application/interfaces/contact-message-sender";
import { buildContactController } from "../../contact/infrastructure/controllers/contact-controller";
import { SmtpContactMessageSender } from "../../contact/infrastructure/providers/smtp-contact-message-sender";
import { loadAppConfig } from "../config/app-config";

export function createServerApp(): Hono {
  const app = new Hono();
  const appConfig = loadAppConfig();
  const certificateRepository = new SqliteCertificateRepository();
  const hashProvider = new NodeCryptoHashProvider();
  const evidenceProvider = new CubepathTimeEvidenceProvider();
  const certifyContentUseCase = new CertifyContentUseCase(
    certificateRepository,
    hashProvider,
    evidenceProvider
  );
  const getCertificateUseCase = new GetCertificateUseCase(certificateRepository);
  const verifyHashUseCase = new VerifyHashUseCase(certificateRepository);
  const countCertificatesUseCase = new CountCertificatesUseCase(certificateRepository);
  const contactMessageSender: ContactMessageSender =
    process.env.DISABLE_SMTP === "1" || appConfig.contact.smtp.host === "smtp.example.com"
      ? {
          send: async () => undefined
        }
      : new SmtpContactMessageSender(appConfig.contact.smtp);
  const contactRequestUseCase = new ContactRequestUseCase(
    contactMessageSender,
    appConfig.contact.defaultSubject
  );

  app.use("/api/*", cors());

  app.get("/health", (c) => c.json({ status: "ok", service: "doccum-backend" }));
  app.get("/api/public-config", (c) =>
    c.json({
      certification: {
        maxUploadBytes: appConfig.certification.maxUploadBytes
      },
      ui: {
        hackathonBanner: appConfig.ui.hackathonBanner
      },
      owner: appConfig.owner
    })
  );
  app.route(
    "/api",
    buildCertifyController({
      certifyContentUseCase,
      maxUploadBytes: appConfig.certification.maxUploadBytes
    })
  );
  app.route("/api", buildGetCertificateController({ getCertificateUseCase }));
  app.route(
    "/api",
    buildVerifyController({
      verifyHashUseCase,
      hashProvider,
      maxUploadBytes: appConfig.certification.maxUploadBytes
    })
  );
  app.route("/api", buildCountController({ countCertificatesUseCase, certificateRepository }));
  app.route("/api", buildCertifyTextController({ certifyContentUseCase }));
  app.route(
    "/api",
    buildContactController({
      contactRequestUseCase
    })
  );

  return app;
}
