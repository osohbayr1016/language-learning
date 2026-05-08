/** Нэг мөр: ханз(ууд) / pinyin ### монгол утга (ж: Quizlet paste). */

const SPLIT = /\s+###\s+/;
const LEFT_HANZI_PINYIN = /^(\p{Script=Han}+)\s+(.+)$/u;

export type ParsedImportLineOk = { ok: true; hanzi: string; pinyin: string; meaning_mn: string };
export type ParsedImportLineErr = { ok: false; line: string; reason: string };
export type ParsedImportLine = ParsedImportLineOk | ParsedImportLineErr;

export function parseHanziImportLines(text: string): ParsedImportLine[] {
  const out: ParsedImportLine[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    const segs = line.split(SPLIT);
    if (segs.length < 2) {
      out.push({ ok: false, line, reason: '### Тусгаарлагч олдсонгүй' });
      continue;
    }

    const left = segs[0]!.trim();
    const meaning_mn = segs.slice(1).join(' ### ').trim();
    if (!meaning_mn) {
      out.push({ ok: false, line, reason: 'Монгол утга хоосон' });
      continue;
    }

    const lm = left.match(LEFT_HANZI_PINYIN);
    if (!lm) {
      out.push({
        ok: false,
        line,
        reason: 'Эхлээд ханз, дараа нь pinyin байх ёстой',
      });
      continue;
    }

    const hanzi = lm[1]!.trim();
    const pinyin = lm[2]!.trim();
    if (!hanzi || !pinyin) {
      out.push({ ok: false, line, reason: 'Ханз эсвэл pinyin хоосон' });
      continue;
    }

    out.push({ ok: true, hanzi, pinyin, meaning_mn });
  }
  return out;
}
