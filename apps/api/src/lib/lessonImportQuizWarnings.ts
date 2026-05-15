import type { ImportedLessonContent } from './lessonImportTypes';

function quizletKanjiKeys(quizletText: string): Set<string> {
  const keys = new Set<string>();
  for (const line of quizletText.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    const sep = t.indexOf('###');
    if (sep < 0) continue;
    const left = t.slice(0, sep).trim();
    if (!left) continue;
    // First token on the left — works for both kanji and kana
    const kanji = left.split(/\s+/)[0] ?? '';
    if (kanji) keys.add(kanji);
  }
  return keys;
}

export function vocabQuizMismatchWarnings(content: ImportedLessonContent): string[] {
  const warns: string[] = [];
  const qt = content.quizlet_text.trim();
  if (!qt) {
    if (content.vocab.length) {
      warns.push('Quizlet (<pre id="quiz">) хоосон — зөвхөн JSON-ын үгийн сангаар шалгана.');
    }
    return warns;
  }
  const quizKeys = quizletKanjiKeys(content.quizlet_text);
  const vocabSet = new Set(content.vocab.map((v) => v.kanji.trim()).filter(Boolean));
  for (const h of vocabSet) {
    if (!quizKeys.has(h)) warns.push(`JSON vocab «${h}» Quizlet мөрөнд олдсонгүй.`);
  }
  for (const h of quizKeys) {
    if (!vocabSet.has(h)) warns.push(`Quizlet «${h}» JSON vocab-д байхгүй.`);
  }
  return warns;
}
