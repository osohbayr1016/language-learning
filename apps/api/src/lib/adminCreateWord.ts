import { fetchHanziWriterMeta } from './hanziWriterCdn';

const MAX_HANZI_CODEPOINTS = 48;
const MAX_TEXTBOOK_UNIT_LEN = 120;

export type AdminWordCreateInput = {
  hanzi: string;
  pinyin: string;
  meaning_mn: string;
  meaning_en?: string;
  hsk_level?: number;
  part_of_speech?: string;
  example_zh?: string;
  example_pinyin?: string;
  example_mn?: string;
  textbook_unit?: string | null;
};

export type InsertAdminWordResult =
  | { kind: 'inserted'; id: number; hanzi: string }
  | { kind: 'skipped_dup'; hanzi: string }
  | { kind: 'error'; hanzi: string; message: string };

function normTextbookUnit(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  if (!t) return null;
  if (t.length > MAX_TEXTBOOK_UNIT_LEN) return t.slice(0, MAX_TEXTBOOK_UNIT_LEN);
  return t;
}

export function validateHanziField(raw: string): { ok: string } | { error: string } {
  const hz = raw.trim();
  if (!hz) return { error: 'Ханз оруулна уу' };
  if ([...hz].length > MAX_HANZI_CODEPOINTS) {
    return { error: `Ханз хамгийн ихдээ ${MAX_HANZI_CODEPOINTS} тэмдэгт` };
  }
  if (!/^\p{Script=Han}+$/u.test(hz)) {
    return { error: 'Зөвхөн ханз текст оруулна уу' };
  }
  return { ok: hz };
}

export async function sumStrokesForHanziPhrase(hanzi: string): Promise<{ strokeCount: number } | { error: string }> {
  let total = 0;
  for (const ch of hanzi) {
    const meta = await fetchHanziWriterMeta(ch);
    if (!meta) {
      return {
        error: `Тэмдэгт "${ch}"-д HanziWriter stroke өгөгдөл байхгүй.`,
      };
    }
    total += meta.strokeCount;
  }
  return { strokeCount: total };
}

function dupKey(hz: string, mn: string): string {
  return `${hz}\u0001${mn}`;
}

async function duplicateExists(db: D1Database, hz: string, mn: string): Promise<boolean> {
  const row = await db
    .prepare('SELECT id FROM words WHERE hanzi = ? AND meaning_mn = ? LIMIT 1')
    .bind(hz, mn)
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
  const v = validateHanziField(typeof raw.hanzi === 'string' ? raw.hanzi : '');
  if ('error' in v) return { kind: 'error', hanzi: (typeof raw.hanzi === 'string' ? raw.hanzi.trim() : '') || '—', message: v.error };

  const hz = v.ok;

  const pinyin = typeof raw.pinyin === 'string' ? raw.pinyin.trim() : '';
  const meaning_mn = typeof raw.meaning_mn === 'string' ? raw.meaning_mn.trim() : '';
  if (!pinyin || !meaning_mn) {
    return { kind: 'error', hanzi: hz, message: 'Pinyin болон монгол утга заавал' };
  }

  const dupPolicy = opts?.duplicatePolicy ?? 'allow';
  const k = dupKey(hz, meaning_mn);
  let isDup = opts?.existingDupKeys?.has(k) ?? false;
  if (!isDup && dupPolicy !== 'allow') {
    isDup = await duplicateExists(db, hz, meaning_mn);
  }
  if (isDup) {
    if (dupPolicy === 'fail') {
      return { kind: 'error', hanzi: hz, message: 'Энэ ханз ба монгол утга өгөгдөлд байна (давхардал)' };
    }
    if (dupPolicy === 'skip') {
      return { kind: 'skipped_dup', hanzi: hz };
    }
  }

  const strokes = await sumStrokesForHanziPhrase(hz);
  if ('error' in strokes) return { kind: 'error', hanzi: hz, message: strokes.error };

  const hsk = Math.min(6, Math.max(1, Number(raw.hsk_level ?? 1)));
  const meaning_en = typeof raw.meaning_en === 'string' ? raw.meaning_en.trim() : '';
  const pos = typeof raw.part_of_speech === 'string' ? raw.part_of_speech.trim() || 'noun' : 'noun';
  const exZh = typeof raw.example_zh === 'string' ? raw.example_zh.trim() : '';
  const exPy = typeof raw.example_pinyin === 'string' ? raw.example_pinyin.trim() : '';
  const exMn = typeof raw.example_mn === 'string' ? raw.example_mn.trim() : '';
  const textbookUnit = normTextbookUnit(raw.textbook_unit);

  const row = await db
    .prepare(
      `INSERT INTO words (
      hanzi, pinyin, pinyin_numbered, tones, meaning_mn, meaning_en, hsk_level,
      part_of_speech, example_zh, example_pinyin, example_mn, stroke_count, textbook_unit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`
    )
    .bind(
      hz,
      pinyin,
      pinyin,
      '[]',
      meaning_mn,
      meaning_en,
      hsk,
      pos,
      exZh,
      exPy,
      exMn,
      strokes.strokeCount,
      textbookUnit
    )
    .first<{ id: number }>();

  if (!row?.id) return { kind: 'error', hanzi: hz, message: 'Өгөгдөл хадгалагдаагүй' };
  opts?.existingDupKeys?.add(k);
  return { kind: 'inserted', id: row.id, hanzi: hz };
}
