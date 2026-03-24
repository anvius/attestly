import { Hono } from "hono";
import { cors } from "hono/cors";
import { CertifyContentUseCase } from "../../certification/application/certify-content-use-case";
import { GetCertificateUseCase } from "../../certification/application/get-certificate-use-case";
import { buildCertifyController } from "../../certification/infrastructure/controllers/certify-controller";
import { buildGetCertificateController } from "../../certification/infrastructure/controllers/get-certificate-controller";
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
  const contactMessageSender: ContactMessageSender =
    process.env.DISABLE_SMTP === "1"
      ? {
          send: async () => undefined
        }
      : new SmtpContactMessageSender(appConfig.contact.smtp);
  const contactRequestUseCase = new ContactRequestUseCase(
    appConfig.contact.captcha.firstOperand + appConfig.contact.captcha.secondOperand,
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
      }
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
    buildContactController({
      contactRequestUseCase,
      captchaFirstOperand: appConfig.contact.captcha.firstOperand,
      captchaSecondOperand: appConfig.contact.captcha.secondOperand
    })
  );

  return app;
}
