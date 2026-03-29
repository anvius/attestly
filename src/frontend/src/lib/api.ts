export type CertificateDto = {
  id: string;
  hash: string;
  timestamp: string;
  fileName: string | null;
  contentType: string | null;
  originalContentPreview: string | null;
  chainIndex: number;
  previousCertificateDigest: string;
  certificateDigest: string;
  cubepathUnixTimeCheckedAt: string | null;
  cubepathUnixTimeSourceHash: string | null;
  cubepathStatusCheckedAt: string | null;
  cubepathStatusSourceHash: string | null;
  storesFileName: boolean;
  storesOriginalContent: boolean;
};

export type PublicConfigDto = {
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

export type ContactConfigDto = {
  captcha: {
    firstOperand: number;
    secondOperand: number;
    token?: string;
  };
};

export type ContactResponseDto = {
  ok: boolean;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function certifyFile(file: File): Promise<CertificateDto> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/certify`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Certification failed");
  }

  return (await response.json()) as CertificateDto;
}

export async function getCertificate(id: string, requestFetch: typeof fetch): Promise<CertificateDto> {
  const response = await requestFetch(`${API_BASE_URL}/api/cert/${id}`);

  if (!response.ok) {
    throw new Error("Certificate not found");
  }

  return (await response.json()) as CertificateDto;
}

export async function getPublicConfig(requestFetch: typeof fetch = fetch): Promise<PublicConfigDto> {
  const response = await requestFetch(`${API_BASE_URL}/api/public-config`);

  if (!response.ok) {
    throw new Error("Public config unavailable");
  }

  return (await response.json()) as PublicConfigDto;
}

export async function getContactConfig(requestFetch: typeof fetch = fetch): Promise<ContactConfigDto> {
  const response = await requestFetch(`${API_BASE_URL}/api/contact/config`);

  if (!response.ok) {
    throw new Error("Contact config unavailable");
  }

  return (await response.json()) as ContactConfigDto;
}

export async function sendContactMessage(input: {
  name: string;
  email: string;
  message: string;
  captchaAnswer: number;
  captchaToken?: string;
  honeypot: string;
}): Promise<ContactResponseDto> {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Contact request failed");
  }

  return (await response.json()) as ContactResponseDto;
}

export type VerifyResultDto = {
  verified: boolean;
  hash: string;
  certificate: {
    id: string;
    hash: string;
    timestamp: string;
    chainIndex: number;
    certificateDigest: string;
  } | null;
};

export type CertificateCountDto = {
  total: number;
};

export async function verifyFile(file: File): Promise<VerifyResultDto> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/verify`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Verification failed");
  }

  return (await response.json()) as VerifyResultDto;
}

export async function getCertificateCount(
  requestFetch: typeof fetch = fetch
): Promise<CertificateCountDto> {
  const response = await requestFetch(`${API_BASE_URL}/api/certificates/count`);

  if (!response.ok) {
    throw new Error("Count unavailable");
  }

  return (await response.json()) as CertificateCountDto;
}

export async function getLatestCertificateId(
  requestFetch: typeof fetch = fetch
): Promise<string | null> {
  const response = await requestFetch(`${API_BASE_URL}/api/certificates/latest`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { id: string | null };
  return data.id;
}

export async function certifyText(text: string): Promise<CertificateDto> {
  const response = await fetch(`${API_BASE_URL}/api/certify-text`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!response.ok) {
    throw new Error("Text certification failed");
  }

  return (await response.json()) as CertificateDto;
}
