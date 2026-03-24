import { Hono } from "hono";
import { cors } from "hono/cors";
import { CertifyContent } from "../certification/application/certify-content";
import { GetCertificate } from "../certification/application/get-certificate";
import { createCertifyContentEndpoint } from "../certification/infrastructure/certify-content-http";
import { createGetCertificateEndpoint } from "../certification/infrastructure/get-certificate-http";
import { CubepathEvidenceCollector } from "../certification/infrastructure/cubepath-evidence-collector";
import { CryptoHashCalculator } from "../certification/infrastructure/crypto-hash-calculator";
import { SqliteCertificateStore } from "../certification/infrastructure/sqlite-certificate-store";
import { SendContactRequest } from "../contact/application/send-contact-request";
import type { ContactNotifier } from "../contact/domain/contact-notifier";
import { createContactEndpoints } from "../contact/infrastructure/contact-http";
import { SmtpContactNotifier } from "../contact/infrastructure/smtp-contact-notifier";
import { loadConfig } from "./load-config";

export function createApp(): Hono {
  const app = new Hono();
  const appConfig = loadConfig();
  const certificateStore = new SqliteCertificateStore();
  const hashCalculator = new CryptoHashCalculator();
  const evidenceCollector = new CubepathEvidenceCollector();
  const certifyContent = new CertifyContent(
    certificateStore,
    hashCalculator,
    evidenceCollector
  );
  const getCertificate = new GetCertificate(certificateStore);
  const contactNotifier: ContactNotifier =
    process.env.DISABLE_SMTP === "1"
      ? {
          send: async () => undefined
        }
      : new SmtpContactNotifier(appConfig.contact.smtp);
  const sendContactRequest = new SendContactRequest(
    contactNotifier,
    appConfig.contact.defaultSubject
  );

  app.use("/api/*", cors());

  app.get("/health", (c) => c.json({ status: "ok", service: "doccum-backend" }));
  app.get("/api/public-config", (c) =>
    c.json({
      branding: appConfig.branding,
      identity: appConfig.identity,
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
    createCertifyContentEndpoint({
      certifyContent,
      maxUploadBytes: appConfig.certification.maxUploadBytes
    })
  );
  app.route("/api", createGetCertificateEndpoint({ getCertificate }));
  app.route(
    "/api",
    createContactEndpoints({
      sendContactRequest
    })
  );

  return app;
}
