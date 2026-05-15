import type { Context } from 'hono';

/** Invalid or empty JSON body (e.g. client sent blank POST). */
export async function readJsonBody<T>(c: Context): Promise<T | null> {
  try {
    return await c.req.json<T>();
  } catch {
    return null;
  }
}

export function jsonBodyInvalid(c: Context) {
  return c.json({ error: 'Хүсэлтийн өгөгдөл ойлгогдохгүй байна' }, 400);
}
