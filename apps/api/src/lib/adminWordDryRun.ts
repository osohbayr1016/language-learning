import { validateHanziField, sumStrokesForHanziPhrase, type AdminWordCreateInput } from './adminCreateWord';

/** Серверээс ханз болон Hanzi Writer шалгах (өгөгдөл хадгалахгүй). */
export async function dryRunValidateAdminWord(
  raw: AdminWordCreateInput
): Promise<
  | { ok: true; hanzi: string; strokeCount: number }
  | { ok: false; hanzi: string; error: string }
> {
  const hzRaw = typeof raw.hanzi === 'string' ? raw.hanzi.trim() : '';
  const v = validateHanziField(hzRaw);
  if ('error' in v) return { ok: false, hanzi: hzRaw || '—', error: v.error };

  const pinyin = typeof raw.pinyin === 'string' ? raw.pinyin.trim() : '';
  const meaning_mn = typeof raw.meaning_mn === 'string' ? raw.meaning_mn.trim() : '';
  if (!pinyin || !meaning_mn) {
    return { ok: false, hanzi: v.ok, error: 'Pinyin болон монгол утга заавал' };
  }

  const strokes = await sumStrokesForHanziPhrase(v.ok);
  if ('error' in strokes) return { ok: false, hanzi: v.ok, error: strokes.error };

  return { ok: true, hanzi: v.ok, strokeCount: strokes.strokeCount };
}

function pairKey(hanzi: string, meaningMn: string): string {
  return `${hanzi}\u0001${meaningMn}`;
}

/** Олон давхцлыг өгөгдөлд байгаа эсэх шалгаж set буцаана. */
export async function fetchExistingHanziMnPairs(
  db: D1Database,
  pairs: { hanzi: string; meaning_mn: string }[]
): Promise<Set<string>> {
  const out = new Set<string>();
  const seen = new Map<string, { hanzi: string; meaning_mn: string }>();
  for (const p of pairs) {
    const k = pairKey(p.hanzi.trim(), p.meaning_mn.trim());
    seen.set(k, { hanzi: p.hanzi.trim(), meaning_mn: p.meaning_mn.trim() });
  }
  const unique = [...seen.values()];
  if (unique.length === 0) return out;

  const CHUNK = 40;
  for (let i = 0; i < unique.length; i += CHUNK) {
    const slice = unique.slice(i, i + CHUNK);
    const cond = slice.map(() => '(hanzi = ? AND meaning_mn = ?)').join(' OR ');
    const args = slice.flatMap((p) => [p.hanzi, p.meaning_mn]);
    const q = await db.prepare(`SELECT hanzi, meaning_mn FROM words WHERE ${cond}`).bind(...args).all();
    for (const row of q.results ?? []) {
      const r = row as { hanzi: string; meaning_mn: string };
      out.add(pairKey(r.hanzi, r.meaning_mn));
    }
  }
  return out;
}
