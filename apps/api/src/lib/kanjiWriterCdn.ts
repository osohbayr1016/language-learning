const KANJI_DATA_VERSION = '2.0.1';

/** CDN дээрх kanji-writer-data нэг тэмдэгт — strokes массив нь зурлагын тоо. */
export async function fetchKanjiWriterMeta(char: string): Promise<{ strokeCount: number } | null> {
  const enc = encodeURIComponent(char);
  // Try KanjiVG data for Japanese kanji strokes
  const url = `https://cdn.jsdelivr.net/npm/hanzi-writer-data@${KANJI_DATA_VERSION}/${enc}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = (await res.json()) as { strokes?: unknown[] };
    const strokes = j.strokes;
    if (!Array.isArray(strokes) || strokes.length === 0) return null;
    return { strokeCount: strokes.length };
  } catch {
    return null;
  }
}
