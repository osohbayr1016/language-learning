/** Normalize Expo Router search params for `lessonId`. */
export function lessonIdFromParams(p: { lessonId?: string | string[] }): string | undefined {
  const r = p.lessonId;
  return Array.isArray(r) ? r[0] : r;
}
