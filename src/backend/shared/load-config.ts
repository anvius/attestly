import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type AppConfig = {
  branding: {
    name: string;
    domain: string;
    taglineEs: string;
    taglineEn: string;
  };
  identity: {
    authorName: string;
    authorUrl: string;
    madeInLabel: string;
    links: {
      github: string;
      codeberg: string;
      mastodon: string;
    };
  };
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
  owner: {
    legalName: string;
    tin: string;
    address: string;
    contactEmail: string;
    url: string;
  };
};

const DEFAULT_CONFIG: AppConfig = {
  branding: {
    name: "DOCCUM",
    domain: "doccum.com",
    taglineEs: "Certificación criptográfica de documentos",
    taglineEn: "Cryptographic document certification"
  },
  identity: {
    authorName: "@anvius",
    authorUrl: "https://anvius.com",
    madeInLabel: "Mojácar",
    links: {
      github: "https://github.com/anvius/hackaton-midudev-2026",
      codeberg: "https://codeberg.org/anvius",
      mastodon: "https://fosstodon.org/@anvius"
    }
  },
  certification: {
    maxUploadBytes: 25 * 1024 * 1024
  },
  contact: {
    defaultSubject: "Contacto desde DOCCUM",
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
  },
  owner: {
    legalName: "Developer / DOCCUM Owner",
    tin: "00000000X",
    address: "Calle Hackaton 123",
    contactEmail: "admin@example.com",
    url: "https://example.com"
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
    branding: {
      name:
        typeof source.branding?.name === "string" && source.branding.name.trim().length > 0
          ? source.branding.name.trim()
          : DEFAULT_CONFIG.branding.name,
      domain:
        typeof source.branding?.domain === "string" && source.branding.domain.trim().length > 0
          ? source.branding.domain.trim()
          : DEFAULT_CONFIG.branding.domain,
      taglineEs:
        typeof source.branding?.taglineEs === "string" && source.branding.taglineEs.trim().length > 0
          ? source.branding.taglineEs.trim()
          : DEFAULT_CONFIG.branding.taglineEs,
      taglineEn:
        typeof source.branding?.taglineEn === "string" && source.branding.taglineEn.trim().length > 0
          ? source.branding.taglineEn.trim()
          : DEFAULT_CONFIG.branding.taglineEn
    },
    identity: {
      authorName:
        typeof source.identity?.authorName === "string" && source.identity.authorName.trim().length > 0
          ? source.identity.authorName.trim()
          : DEFAULT_CONFIG.identity.authorName,
      authorUrl:
        typeof source.identity?.authorUrl === "string" && source.identity.authorUrl.trim().length > 3
          ? source.identity.authorUrl.trim()
          : DEFAULT_CONFIG.identity.authorUrl,
      madeInLabel:
        typeof source.identity?.madeInLabel === "string" && source.identity.madeInLabel.trim().length > 0
          ? source.identity.madeInLabel.trim()
          : DEFAULT_CONFIG.identity.madeInLabel,
      links: {
        github:
          typeof source.identity?.links?.github === "string" && source.identity.links.github.trim().length > 5
            ? source.identity.links.github.trim()
            : DEFAULT_CONFIG.identity.links.github,
        codeberg:
          typeof source.identity?.links?.codeberg === "string" && source.identity.links.codeberg.trim().length > 5
            ? source.identity.links.codeberg.trim()
            : DEFAULT_CONFIG.identity.links.codeberg,
        mastodon:
          typeof source.identity?.links?.mastodon === "string" && source.identity.links.mastodon.trim().length > 5
            ? source.identity.links.mastodon.trim()
            : DEFAULT_CONFIG.identity.links.mastodon
      }
    },
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
          process.env.SMTP_USERNAME ?? 
          (typeof source.contact?.smtp?.username === "string" && source.contact.smtp.username.trim().length > 2
            ? source.contact.smtp.username.trim()
            : DEFAULT_CONFIG.contact.smtp.username),
        password:
          process.env.SMTP_PASSWORD ?? 
          (typeof source.contact?.smtp?.password === "string" && source.contact.smtp.password.trim().length > 0
            ? source.contact.smtp.password
            : DEFAULT_CONFIG.contact.smtp.password),
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
    },
    owner: {
      legalName:
        typeof source.owner?.legalName === "string" && source.owner.legalName.trim().length > 2
          ? source.owner.legalName.trim()
          : DEFAULT_CONFIG.owner.legalName,
      tin:
        typeof source.owner?.tin === "string" && source.owner.tin.trim().length > 1
          ? source.owner.tin.trim()
          : DEFAULT_CONFIG.owner.tin,
      address:
        typeof source.owner?.address === "string" && source.owner.address.trim().length > 5
          ? source.owner.address.trim()
          : DEFAULT_CONFIG.owner.address,
      contactEmail:
        typeof source.owner?.contactEmail === "string" && source.owner.contactEmail.trim().length > 5
          ? source.owner.contactEmail.trim()
          : DEFAULT_CONFIG.owner.contactEmail,
      url:
        typeof source.owner?.url === "string" && source.owner.url.trim().length > 5
          ? source.owner.url.trim()
          : DEFAULT_CONFIG.owner.url
    }
  };
}

export function loadConfig(): AppConfig {
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
