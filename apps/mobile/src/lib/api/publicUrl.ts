import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Production API (same Cloudflare account as chinese-learning-web in wrangler). */
export const DEFAULT_PRODUCTION_API = 'https://chinese-learning-api.osohoo691016.workers.dev';

function extraApiUrl(): string | undefined {
  const u = Constants.expoConfig?.extra?.apiUrl;
  return typeof u === 'string' ? u.trim() : undefined;
}

/** Reject relative `/api` bases and empty strings — those make fetch hit the SPA and return HTML 200. */
function asAbsoluteHttpBase(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const t = raw.trim().replace(/\/+$/, '');
  if (!t) return undefined;
  if ((t.startsWith('/') && !t.startsWith('//')) || t === '.') return undefined;
  if (!/^https?:\/\//i.test(t)) return undefined;
  return t;
}

/** EXPO_PUBLIC_API_URL заримдаа вэб static worker-ийн URL болж орсон — SPA /api руу очиж HTML 200 буцаана. */
function rejectIfWebAppOrigin(candidate: string | undefined): string | undefined {
  if (!candidate) return undefined;
  const loc = (globalThis as { window?: { location?: { hostname: string } } }).window?.location;
  if (!loc?.hostname) return candidate;
  try {
    if (new URL(candidate).hostname === loc.hostname) return undefined;
  } catch {
    return undefined;
  }
  return candidate;
}

/**
 * Буйлд нь localhost:8787 орсон чийгээр вэбийг production-д нээвэл хоосон DB / алдаатай суурь болно.
 * Зөвхөн хуудас өөрөө localhost дээр байвал localhost API зөвшөөрнө (эсвэл native — window байхгүй).
 */
function rejectLocalhostApiWhenNotOnLocalWeb(candidate: string | undefined): string | undefined {
  if (!candidate) return undefined;
  let apiHost: string;
  try {
    apiHost = new URL(candidate).hostname;
  } catch {
    return undefined;
  }
  if (apiHost !== 'localhost' && apiHost !== '127.0.0.1') return candidate;
  const loc = (globalThis as { window?: { location?: { hostname?: string } } }).window?.location;
  if (!loc?.hostname) return candidate;
  const pageHost = loc.hostname;
  if (pageHost === 'localhost' || pageHost === '127.0.0.1') return candidate;
  return undefined;
}

function pickApiBaseCandidate(raw: string | undefined): string | undefined {
  return rejectLocalhostApiWhenNotOnLocalWeb(rejectIfWebAppOrigin(asAbsoluteHttpBase(raw)));
}

function stripTrailingSlashes(base: string): string {
  return base.replace(/\/+$/, '');
}

/** Web: loopback суурь биш эхний нэршил зөв суурийг сонгоно (`EXPO_PUBLIC_API_URL`/extra). */
function firstNonLoopbackApiCandidate(): string | undefined {
  const sources = [process.env.EXPO_PUBLIC_API_URL?.trim(), extraApiUrl()] as const;

  for (const raw of sources) {
    const c = pickApiBaseCandidate(raw);
    if (!c) continue;
    try {
      const h = new URL(c).hostname;
      if (h !== 'localhost' && h !== '127.0.0.1') return c;
    } catch {
      continue;
    }
  }
  return undefined;
}

const USE_LOCAL_WEB_API_LOOPBACK =
  process.env.EXPO_PUBLIC_USE_LOCAL_WEB_API === '1' ||
  process.env.EXPO_PUBLIC_USE_LOCAL_WEB_API === 'true';

export function resolveApiBase(): string {
  if (Platform.OS === 'web') {
    if (USE_LOCAL_WEB_API_LOOPBACK) {
      const fromEnv = pickApiBaseCandidate(process.env.EXPO_PUBLIC_API_URL?.trim());
      const fromExtra = pickApiBaseCandidate(extraApiUrl());
      return stripTrailingSlashes(fromEnv ?? fromExtra ?? 'http://localhost:8787');
    }

    const remote = firstNonLoopbackApiCandidate();
    if (remote) return stripTrailingSlashes(remote);

    return stripTrailingSlashes(DEFAULT_PRODUCTION_API);
  }

  const fromEnv = pickApiBaseCandidate(process.env.EXPO_PUBLIC_API_URL?.trim());
  if (fromEnv) return stripTrailingSlashes(fromEnv);

  const fromExtra = pickApiBaseCandidate(extraApiUrl());
  if (fromExtra) return stripTrailingSlashes(fromExtra);

  return stripTrailingSlashes(DEFAULT_PRODUCTION_API);
}
