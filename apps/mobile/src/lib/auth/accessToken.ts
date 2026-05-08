import { isTruthyAdmin } from './isTruthyAdmin';

/** Зөвхөн задлах (verify хийгээгүй) — bootstrap болон admin гарын үүнд. */
export function parseJwtPayloadUnsafe(accessToken: string | null): Record<string, unknown> | null {
  if (!accessToken) return null;
  const parts = accessToken.split('.');
  if (parts.length !== 3) return null;
  try {
    const segment = parts[1];
    const pad = segment.length % 4 === 0 ? '' : '='.repeat(4 - (segment.length % 4));
    const b64 = segment.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const json = atob(b64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getJwtExpiryUnix(accessToken: string | null): number | null {
  const payload = parseJwtPayloadUnsafe(accessToken);
  const exp = payload?.exp;
  return typeof exp === 'number' ? exp : null;
}

export function getJwtIsAdmin(accessToken: string | null): boolean {
  const payload = parseJwtPayloadUnsafe(accessToken);
  return isTruthyAdmin(payload?.is_admin);
}

/** true: access байхгүй, буруу формат, дууссан, эсвэл skewSeconds-с дотор дуусна. */
export function accessTokenNeedsRefresh(accessToken: string | null, skewSeconds = 60): boolean {
  if (!accessToken) return true;
  const exp = getJwtExpiryUnix(accessToken);
  if (exp == null) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + skewSeconds;
}
