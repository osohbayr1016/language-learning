export const API_URL =
  (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL ?? 'http://localhost:8787';

export async function req<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((headers as Record<string, string>) ?? {}),
  };
  const res = await fetch(`${API_URL}${path}`, { ...rest, headers: finalHeaders });
  const data = (await res.json().catch(() => null)) as { error?: string; hint?: string } | null;
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    const hint = typeof data?.hint === 'string' && data.hint ? `\n\n${data.hint}` : '';
    throw new Error(`${msg}${hint}`);
  }
  return data as T;
}
