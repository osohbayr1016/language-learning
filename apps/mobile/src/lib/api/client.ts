import { resolveApiBase } from './publicUrl';
import { getItem, removeItem, setItem } from '../storage';
import {
  AUTH_ACCESS_TOKEN_KEY,
  AUTH_REFRESH_TOKEN_KEY,
} from '../auth/tokenStorageKeys';
import { emitAccessTokenRefreshed, emitSessionCleared } from '../auth/authEvents';

/** Resolve at call time so static web bundles get the live origin (not build-time undefined). */
export function getApiBase(): string {
  return resolveApiBase();
}

function isAuthPathWithoutRetry(path: string): boolean {
  const p = path.split('?')[0];
  return (
    p === '/api/auth/refresh' ||
    p === '/api/auth/login' ||
    p === '/api/auth/register' ||
    p === '/api/auth/logout'
  );
}

async function fetchAccessTokenWithRefresh(refreshToken: string): Promise<string> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
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
  if (!text.trim()) throw new Error('Хоосон хариу');
  const parsed = JSON.parse(text) as { data?: { access_token?: string } };
  const access = parsed.data?.access_token;
  if (!access) throw new Error('access_token алга');
  return access;
}

async function clearStoredSession(): Promise<void> {
  await removeItem(AUTH_ACCESS_TOKEN_KEY);
  await removeItem(AUTH_REFRESH_TOKEN_KEY);
  emitSessionCleared();
}

async function doFetch(
  path: string,
  rest: RequestInit,
  token: string | undefined
): Promise<{ res: Response; text: string }> {
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
  return { res, text };
}

function parseOkResponse<T>(res: Response, text: string): T {
  if (!text.trim()) {
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      'API суурь буруу эсвэл вэб SPA HTML ирлээ. EXPO_PUBLIC_API_URL нь япон API Workers (`nihongo-mn-api.*.workers.dev`) байх ёстой.'
    );
  }
}

export async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token: tokenOpt, ...rest } = options;
  let token = tokenOpt;

  let { res, text } = await doFetch(path, rest, token);

  if (res.status === 401 && tokenOpt && !isAuthPathWithoutRetry(path)) {
    const refresh = await getItem(AUTH_REFRESH_TOKEN_KEY);
    if (refresh) {
      try {
        const newAccess = await fetchAccessTokenWithRefresh(refresh);
        await setItem(AUTH_ACCESS_TOKEN_KEY, newAccess);
        emitAccessTokenRefreshed(newAccess);
        token = newAccess;
        ({ res, text } = await doFetch(path, rest, token));
        if (res.status === 401) await clearStoredSession();
      } catch {
        await clearStoredSession();
      }
    } else {
      await clearStoredSession();
    }
  }

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

  return parseOkResponse<T>(res, text);
}

export function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
  if (entries.length === 0) return '';
  const usp = new URLSearchParams();
  entries.forEach(([k, v]) => usp.append(k, String(v)));
  return `?${usp.toString()}`;
}
