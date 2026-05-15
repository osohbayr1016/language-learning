import { dryRunValidateAdminWord } from './adminWordDryRun';
import { insertAdminWord } from './adminCreateWord';
import type { ImportedVocab } from './lessonImportTypes';

export type ImportedWordLink = { wordId: number; orderNum: number };

export type ImportedWordStats = {
  links: ImportedWordLink[];
  inserted: number;
  reused: number;
};

async function existingWordId(db: D1Database, kanji: string, meaningMn: string): Promise<number | null> {
  const row = await db
    .prepare('SELECT id FROM words WHERE kanji = ? AND meaning_mn = ? LIMIT 1')
    .bind(kanji, meaningMn)
    .first<{ id: number }>();
  return Number.isFinite(row?.id) ? Number(row?.id) : null;
}

export async function validateImportedWords(words: ImportedVocab[]) {
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const res = await dryRunValidateAdminWord({
      kanji: w.kanji,
      romaji: w.romaji,
      kana: w.kana,
      meaning_mn: w.meaning_mn,
      jlpt_level: w.jlpt_level,
    });
    if (!res.ok) throw new Error(`Үг #${i + 1} (${w.kanji}) алдаатай: ${res.error}`);
  }
}

export async function resolveImportedWords(db: D1Database, words: ImportedVocab[]): Promise<ImportedWordStats> {
  const links: ImportedWordLink[] = [];
  let inserted = 0;
  let reused = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    const found = await existingWordId(db, w.kanji, w.meaning_mn);
    if (found) {
      reused += 1;
      links.push({ wordId: found, orderNum: i + 1 });
      continue;
    }

    const created = await insertAdminWord(db, {
      kanji: w.kanji,
      romaji: w.romaji,
      kana: w.kana,
      meaning_mn: w.meaning_mn,
      jlpt_level: w.jlpt_level,
    });
    if (created.kind !== 'inserted') {
      const reason = created.kind === 'error' ? created.message : 'давхардал';
      throw new Error(`Үг #${i + 1} (${w.kanji}) хадгалагдсангүй: ${reason}`);
    }
    inserted += 1;
    links.push({ wordId: created.id, orderNum: i + 1 });
  }

  return { links, inserted, reused };
}
