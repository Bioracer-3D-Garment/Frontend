import { getJwtToken } from "@/service/auth/auth_service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function authHeaders(): Record<string, string> {
  const token = getJwtToken();
  if (!token) throw new Error("JWT token is not set");
  return { Authorization: `Bearer ${token}` };
}

export async function postForJobId(
  path: string,
  body: BodyInit,
  extraHeaders: Record<string, string> = {},
  fallbackError = "Failed to start job",
): Promise<{ jobId: string }> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { ...authHeaders(), ...extraHeaders },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || fallbackError);
  }

  return { jobId: parseJobId(await response.text()) };
}

function parseJobId(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as { jobId?: string };
    if (parsed.jobId) return parsed.jobId;
  } catch {}
  const id = raw.split(": ").pop()?.trim();
  if (id) return id;
  throw new Error("Invalid response from server: no job id");
}

export async function getJson<T>(
  path: string,
  fallbackError = "Request failed",
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error(fallbackError);
  return response.json() as Promise<T>;
}
