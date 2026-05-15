import { fetchKanjiWriterMeta } from './kanjiWriterCdn';

const MAX_KANJI_CODEPOINTS = 48;
const MAX_TEXTBOOK_UNIT_LEN = 120;

export type AdminWordCreateInput = {
  kanji: string;
  romaji: string;
  kana?: string;
  meaning_mn: string;
  meaning_en?: string;
  jlpt_level?: number;
  part_of_speech?: string;
  example_jp?: string;
  example_romaji?: string;
  example_mn?: string;
  textbook_unit?: string | null;
};

export type InsertAdminWordResult =
  | { kind: 'inserted'; id: number; kanji: string }
  | { kind: 'skipped_dup'; kanji: string }
  | { kind: 'error'; kanji: string; message: string };

function normTextbookUnit(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  if (!t) return null;
  if (t.length > MAX_TEXTBOOK_UNIT_LEN) return t.slice(0, MAX_TEXTBOOK_UNIT_LEN);
  return t;
}

export function validateKanjiField(raw: string): { ok: string } | { error: string } {
  const kj = raw.trim();
  if (!kj) return { error: 'Үг оруулна уу' };
  if ([...kj].length > MAX_KANJI_CODEPOINTS) {
    return { error: `Үг хамгийн ихдээ ${MAX_KANJI_CODEPOINTS} тэмдэгт` };
  }
  return { ok: kj };
}

export async function sumStrokesForKanjiPhrase(kanji: string): Promise<{ strokeCount: number } | { error: string }> {
  let total = 0;
  for (const ch of kanji) {
    const meta = await fetchKanjiWriterMeta(ch);
    if (!meta) {
      // Not all Japanese chars have stroke data — return 0 gracefully
      return { strokeCount: 0 };
    }
    total += meta.strokeCount;
  }
  return { strokeCount: total };
}

function dupKey(kj: string, mn: string): string {
  return `${kj}\u0001${mn}`;
}

async function duplicateExists(db: D1Database, kj: string, mn: string): Promise<boolean> {
  const row = await db
    .prepare('SELECT id FROM words WHERE kanji = ? AND meaning_mn = ? LIMIT 1')
    .bind(kj, mn)
    .first<{ id: number }>();
  return row != null && Number.isFinite(row.id);
}

export type InsertAdminWordOptions = {
  duplicatePolicy?: 'allow' | 'fail' | 'skip';
  /** Bulk эхлээд авсан давхардлын set — ижил процессийн дотор шинэ мөрүүд давхардвал гадна шалгуур */
  existingDupKeys?: Set<string>;
};

export async function insertAdminWord(
  db: D1Database,
  raw: AdminWordCreateInput,
  opts?: InsertAdminWordOptions
): Promise<InsertAdminWordResult> {
  const v = validateKanjiField(typeof raw.kanji === 'string' ? raw.kanji : '');
  if ('error' in v) return { kind: 'error', kanji: (typeof raw.kanji === 'string' ? raw.kanji.trim() : '') || '—', message: v.error };

  const kj = v.ok;

  const romaji = typeof raw.romaji === 'string' ? raw.romaji.trim() : '';
  const meaning_mn = typeof raw.meaning_mn === 'string' ? raw.meaning_mn.trim() : '';
  if (!romaji || !meaning_mn) {
    return { kind: 'error', kanji: kj, message: 'Romaji болон монгол утга заавал' };
  }

  const dupPolicy = opts?.duplicatePolicy ?? 'allow';
  const k = dupKey(kj, meaning_mn);
  let isDup = opts?.existingDupKeys?.has(k) ?? false;
  if (!isDup && dupPolicy !== 'allow') {
    isDup = await duplicateExists(db, kj, meaning_mn);
  }
  if (isDup) {
    if (dupPolicy === 'fail') {
      return { kind: 'error', kanji: kj, message: 'Энэ үг ба монгол утга өгөгдөлд байна (давхардал)' };
    }
    if (dupPolicy === 'skip') {
      return { kind: 'skipped_dup', kanji: kj };
    }
  }

  const strokes = await sumStrokesForKanjiPhrase(kj);
  if ('error' in strokes) return { kind: 'error', kanji: kj, message: strokes.error };

  const jlpt = Math.min(5, Math.max(1, Number(raw.jlpt_level ?? 1)));
  const meaning_en = typeof raw.meaning_en === 'string' ? raw.meaning_en.trim() : '';
  const pos = typeof raw.part_of_speech === 'string' ? raw.part_of_speech.trim() || 'noun' : 'noun';
  const exJp = typeof raw.example_jp === 'string' ? raw.example_jp.trim() : '';
  const exRomaji = typeof raw.example_romaji === 'string' ? raw.example_romaji.trim() : '';
  const exMn = typeof raw.example_mn === 'string' ? raw.example_mn.trim() : '';
  const kana = typeof raw.kana === 'string' ? raw.kana.trim() : '';
  const textbookUnit = normTextbookUnit(raw.textbook_unit);

  const row = await db
    .prepare(
      `INSERT INTO words (
      kanji, romaji, romaji_numbered, kana, meaning_mn, meaning_en, jlpt_level,
      part_of_speech, example_jp, example_romaji, example_mn, stroke_count, textbook_unit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
    )
    .bind(
      kj,
      romaji,
      romaji,
      kana,
      meaning_mn,
      meaning_en,
      jlpt,
      pos,
      exJp,
      exRomaji,
      exMn,
      strokes.strokeCount,
      textbookUnit
    )
    .first<{ id: number }>();

  if (!row?.id) return { kind: 'error', kanji: kj, message: 'Өгөгдөл хадгалагдаагүй' };
  opts?.existingDupKeys?.add(k);
  return { kind: 'inserted', id: row.id, kanji: kj };
}
