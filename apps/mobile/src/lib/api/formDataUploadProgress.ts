import { getApiBase } from './client';
import { getItem, removeItem, setItem } from '../storage';
import { AUTH_ACCESS_TOKEN_KEY, AUTH_REFRESH_TOKEN_KEY } from '../auth/tokenStorageKeys';
import { emitAccessTokenRefreshed, emitSessionCleared } from '../auth/authEvents';

async function refreshAccessToken(): Promise<string | null> {
  const refresh = await getItem(AUTH_REFRESH_TOKEN_KEY);
  if (!refresh) return null;
  const base = getApiBase();
  const res = await fetch(`${base}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });
  const text = await res.text();
  if (!res.ok) return null;
  const parsed = JSON.parse(text) as { data?: { access_token?: string } };
  const access = parsed.data?.access_token;
  if (!access) return null;
  await setItem(AUTH_ACCESS_TOKEN_KEY, access);
  emitAccessTokenRefreshed(access);
  return access;
}

function parseXhrJson<T>(xhr: XMLHttpRequest): T {
  const text = xhr.responseText;
  if (!text.trim()) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      'API суурь буруу эсвэл вэб SPA HTML ирлээ. EXPO_PUBLIC_API_URL нь chinese-learning-api.*.workers.dev байх ёстой.'
    );
  }
}

/** XMLHttpRequest upload progress (works on web + React Native). Retries once on 401 after refresh. */
export async function postFormDataWithUploadProgress<T>(opts: {
  path: string;
  token: string;
  buildBody: () => FormData | Promise<FormData>;
  onProgress?: (percent: number) => void;
}): Promise<T> {
  const run = (tok: string, alreadyRetried: boolean): Promise<T> =>
    new Promise((resolve, reject) => {
      void (async () => {
        let body: FormData;
        try {
          body = await opts.buildBody();
        } catch (e) {
          reject(e instanceof Error ? e : new Error('FormData алдаа'));
          return;
        }
        const base = getApiBase();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${base}${opts.path}`);
        xhr.setRequestHeader('Authorization', `Bearer ${tok}`);
        xhr.upload.onprogress = (ev) => {
          if (!opts.onProgress) return;
          if (ev.lengthComputable && ev.total > 0) {
            opts.onProgress(Math.min(100, Math.round((100 * ev.loaded) / ev.total)));
          }
        };
        xhr.onload = () => {
          void (async () => {
            if (xhr.status === 401 && !alreadyRetried) {
              const next = await refreshAccessToken();
              if (!next) {
                await removeItem(AUTH_ACCESS_TOKEN_KEY);
                await removeItem(AUTH_REFRESH_TOKEN_KEY);
                emitSessionCleared();
                reject(new Error('HTTP 401'));
                return;
              }
              try {
                resolve(await run(next, true));
              } catch (e) {
                reject(e instanceof Error ? e : new Error('Алдаа'));
              }
              return;
            }
            if (xhr.status === 401) {
              reject(new Error('HTTP 401'));
              return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
              let msg = `HTTP ${xhr.status}`;
              try {
                const j = parseXhrJson<{ error?: string }>(xhr);
                if (typeof j?.error === 'string' && j.error) msg = j.error;
              } catch {
                /* keep msg */
              }
              reject(new Error(msg));
              return;
            }
            try {
              resolve(parseXhrJson<T>(xhr));
            } catch (e) {
              reject(e instanceof Error ? e : new Error('Хариу буруу'));
            }
          })();
        };
        xhr.onerror = () => reject(new Error('Сүлжээний алдаа'));
        xhr.send(body as never);
      })();
    });

  return run(opts.token, false);
}
