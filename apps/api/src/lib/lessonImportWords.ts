import { dryRunValidateAdminWord } from './adminWordDryRun';
import { insertAdminWord } from './adminCreateWord';
import type { ImportedVocab } from './lessonImportTypes';

export type ImportedWordLink = { wordId: number; orderNum: number };

export type ImportedWordStats = {
  links: ImportedWordLink[];
  inserted: number;
  reused: number;
};

async function existingWordId(db: D1Database, hanzi: string, meaningMn: string): Promise<number | null> {
  const row = await db
    .prepare('SELECT id FROM words WHERE hanzi = ? AND meaning_mn = ? LIMIT 1')
    .bind(hanzi, meaningMn)
    .first<{ id: number }>();
  return Number.isFinite(row?.id) ? Number(row?.id) : null;
}

export async function validateImportedWords(words: ImportedVocab[]) {
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const res = await dryRunValidateAdminWord({
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      meaning_mn: w.meaning_mn,
      hsk_level: w.hsk_level,
    });
    if (!res.ok) throw new Error(`Үг #${i + 1} (${w.hanzi}) алдаатай: ${res.error}`);
  }
}

export async function resolveImportedWords(db: D1Database, words: ImportedVocab[]): Promise<ImportedWordStats> {
  const links: ImportedWordLink[] = [];
  let inserted = 0;
  let reused = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const found = await existingWordId(db, w.hanzi, w.meaning_mn);
    if (found) {
      reused += 1;
      links.push({ wordId: found, orderNum: i + 1 });
      continue;
    }

    const created = await insertAdminWord(db, {
      hanzi: w.hanzi,
      pinyin: w.pinyin,
      meaning_mn: w.meaning_mn,
      hsk_level: w.hsk_level,
    });
    if (created.kind !== 'inserted') {
      const reason = created.kind === 'error' ? created.message : 'давхардал';
      throw new Error(`Үг #${i + 1} (${w.hanzi}) хадгалагдсангүй: ${reason}`);
    }
    inserted += 1;
    links.push({ wordId: created.id, orderNum: i + 1 });
  }

  return { links, inserted, reused };
}
