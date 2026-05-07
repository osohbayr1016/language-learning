import Constants from 'expo-constants';

/** Production API (same Cloudflare account as chinese-learning-web in wrangler). */
export const DEFAULT_PRODUCTION_API = 'https://chinese-learning-api.osohoo691016.workers.dev';

function extraApiUrl(): string | undefined {
  const u = Constants.expoConfig?.extra?.apiUrl;
  return typeof u === 'string' ? u.trim() : undefined;
}

export function resolveApiBase(): string {
  const env = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (env) return env;

  const fromExtra = extraApiUrl();
  if (fromExtra) return fromExtra;

  const loc = (globalThis as { window?: { location?: { hostname?: string } } }).window?.location;
  if (loc?.hostname) {
    const h = loc.hostname;
    if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:8787';
    return DEFAULT_PRODUCTION_API;
  }

  // iOS / Android: локал API ашиглах бол EXPO_PUBLIC_API_URL=http://127.0.0.1:8787 зааж өгнө.
  return DEFAULT_PRODUCTION_API;
}
