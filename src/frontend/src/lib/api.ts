export type CertificateDto = {
  id: string;
  hash: string;
  timestamp: string;
  fileName: string | null;
  contentType: string | null;
  originalContentPreview: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function certifyText(text: string): Promise<CertificateDto> {
  const formData = new FormData();
  formData.append("text", text);

  const response = await fetch(`${API_BASE_URL}/api/certify`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Certification failed");
  }

  return (await response.json()) as CertificateDto;
}

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
