/** Public URL for R2 keys served at GET /api/lessons/imported-file/:key */
export function lessonImportedFilePublicUrl(req: Request, storageKey: string): string {
  const u = new URL(req.url);
  return `${u.origin}/api/lessons/imported-file/${encodeURIComponent(storageKey)}`;
}
