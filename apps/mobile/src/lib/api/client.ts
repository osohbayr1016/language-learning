import { resolveApiBase } from './publicUrl';

/** Resolve at call time so static web bundles get the live origin (not build-time undefined). */
export function getApiBase(): string {
  return resolveApiBase();
}

export async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...rest } = options;
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((rest.headers as Record<string, string>) ?? {}),
  };
  if (rest.body != null && rest.body !== '') {
    headers['Content-Type'] = 'application/json';
  }

  const base = getApiBase();
  const res = await fetch(`${base}${path}`, { ...rest, headers });
  const text = await res.text();

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = JSON.parse(text) as { error?: string };
      if (typeof j?.error === 'string' && j.error) msg = j.error;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  if (!text.trim()) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      'API суурь буруу эсвэл вэб SPA HTML ирлээ. EXPO_PUBLIC_API_URL нь chinese-learning-api.*.workers.dev байх ёстой.'
    );
  }
}

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  const usp = new URLSearchParams();
  entries.forEach(([k, v]) => usp.append(k, String(v)));
  return `?${usp.toString()}`;
}
