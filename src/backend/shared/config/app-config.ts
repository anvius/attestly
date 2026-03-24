import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type AppConfig = {
  certification: {
    maxUploadBytes: number;
  };
  contact: {
    defaultSubject: string;
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      username: string;
      password: string;
      fromEmail: string;
      toEmail: string;
    };
    captcha: {
      firstOperand: number;
      secondOperand: number;
    };
  };
  ui: {
    hackathonBanner: string;
  };
};

const DEFAULT_CONFIG: AppConfig = {
  certification: {
    maxUploadBytes: 25 * 1024 * 1024
  },
  contact: {
    defaultSubject: "Contacto desde DocCum",
    smtp: {
      host: "smtp.example.com",
      port: 587,
      secure: false,
      username: "doccum-bot@example.com",
      password: "change-me",
      fromEmail: "doccum-bot@example.com",
      toEmail: "contacto@doccum.example"
    },
    captcha: {
      firstOperand: 7,
      secondOperand: 5
    }
  },
  ui: {
    hackathonBanner: "Hackathon build · producto experimental en evolucion"
  }
};

function getCandidatePaths(): string[] {
  const cwd = process.cwd();

  return [
    join(cwd, "etc", "config.json"),
    join(cwd, "..", "..", "etc", "config.json"),
    join(cwd, "..", "etc", "config.json")
  ];
}

function parseConfig(raw: unknown): AppConfig {
  if (!raw || typeof raw !== "object") {
    return DEFAULT_CONFIG;
  }

  const source = raw as Partial<AppConfig>;

  return {
    certification: {
      maxUploadBytes:
        typeof source.certification?.maxUploadBytes === "number" && source.certification.maxUploadBytes > 0
          ? source.certification.maxUploadBytes
          : DEFAULT_CONFIG.certification.maxUploadBytes
    },
    contact: {
      defaultSubject:
        typeof source.contact?.defaultSubject === "string" && source.contact.defaultSubject.trim().length > 1
          ? source.contact.defaultSubject.trim()
          : DEFAULT_CONFIG.contact.defaultSubject,
      smtp: {
        host:
          typeof source.contact?.smtp?.host === "string" && source.contact.smtp.host.trim().length > 2
            ? source.contact.smtp.host.trim()
            : DEFAULT_CONFIG.contact.smtp.host,
        port:
          typeof source.contact?.smtp?.port === "number" && source.contact.smtp.port > 0
            ? source.contact.smtp.port
            : DEFAULT_CONFIG.contact.smtp.port,
        secure:
          typeof source.contact?.smtp?.secure === "boolean"
            ? source.contact.smtp.secure
            : DEFAULT_CONFIG.contact.smtp.secure,
        username:
          typeof source.contact?.smtp?.username === "string" && source.contact.smtp.username.trim().length > 2
            ? source.contact.smtp.username.trim()
            : DEFAULT_CONFIG.contact.smtp.username,
        password:
          typeof source.contact?.smtp?.password === "string" && source.contact.smtp.password.trim().length > 0
            ? source.contact.smtp.password
            : DEFAULT_CONFIG.contact.smtp.password,
        fromEmail:
          typeof source.contact?.smtp?.fromEmail === "string" && source.contact.smtp.fromEmail.trim().length > 3
            ? source.contact.smtp.fromEmail.trim()
            : DEFAULT_CONFIG.contact.smtp.fromEmail,
        toEmail:
          typeof source.contact?.smtp?.toEmail === "string" && source.contact.smtp.toEmail.trim().length > 3
            ? source.contact.smtp.toEmail.trim()
            : DEFAULT_CONFIG.contact.smtp.toEmail
      },
      captcha: {
        firstOperand:
          typeof source.contact?.captcha?.firstOperand === "number"
            ? source.contact.captcha.firstOperand
            : DEFAULT_CONFIG.contact.captcha.firstOperand,
        secondOperand:
          typeof source.contact?.captcha?.secondOperand === "number"
            ? source.contact.captcha.secondOperand
            : DEFAULT_CONFIG.contact.captcha.secondOperand
      }
    },
    ui: {
      hackathonBanner:
        typeof source.ui?.hackathonBanner === "string" && source.ui.hackathonBanner.trim().length > 5
          ? source.ui.hackathonBanner.trim()
          : DEFAULT_CONFIG.ui.hackathonBanner
    }
  };
}

export function loadAppConfig(): AppConfig {
  for (const path of getCandidatePaths()) {
    if (!existsSync(path)) {
      continue;
    }

    try {
      const raw = JSON.parse(readFileSync(path, "utf8")) as unknown;
      return parseConfig(raw);
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  return DEFAULT_CONFIG;
}
