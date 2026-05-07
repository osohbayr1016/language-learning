export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';

export async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((rest.headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  let data: unknown = null;
  try { data = await res.json(); } catch { /* non-json response */ }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  const usp = new URLSearchParams();
  entries.forEach(([k, v]) => usp.append(k, String(v)));
  return `?${usp.toString()}`;
}
