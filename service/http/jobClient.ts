import { getJwtToken } from "@/service/auth/auth_service";

/**
 * Shared helpers for the async "job" endpoints (image batches and turntable videos).
 *
 * Both flows behave the same way at the HTTP level: authenticate with the JWT, POST to start a
 * job and read back its id, then poll a status endpoint. Centralising that here keeps
 * BatchService and VideoService focused on building their request bodies.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Bearer auth header, or throws if the user is not logged in. */
export function authHeaders(): Record<string, string> {
  const token = getJwtToken();
  if (!token) throw new Error("JWT token is not set");
  return { Authorization: `Bearer ${token}` };
}

/**
 * POSTs to a job endpoint and extracts the created job id. Accepts both response shapes the
 * backend may return: JSON (`{ "jobId": "..." }`) or a plain-text confirmation
 * (`"... has been accepted: <jobId>"`).
 */
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
  } catch {
    // Not JSON — fall through to plain-text parsing.
  }
  const id = raw.split(": ").pop()?.trim();
  if (id) return id;
  throw new Error("Invalid response from server: no job id");
}

/** GETs an authenticated JSON endpoint. */
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