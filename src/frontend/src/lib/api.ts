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
  certification: {
    maxUploadBytes: number;
  };
  ui: {
    hackathonBanner: string;
  };
};

export type ContactConfigDto = {
  captcha: {
    firstOperand: number;
    secondOperand: number;
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
