/** Parse Manchester-style HSK2 answer-key text (questions 1–60). */

import { normalizeCapturedAnswer } from './parseAnswerNormalize';
import { patchTf46ReadingSection } from './parseHsk2Tf46Patch';

const TOK =
  '[√×\\u2713\\u2714\\u2611\\u2715\\u2716\\u2717\\u274c對对錯错]|正确|错误|錯誤|不对|[A-Fa-f]';

const RE_MAIN = new RegExp(
  `(?<!\\d)([1-9]|[1-5]\\d|60)(?!\\d)\\s*(?:题\\s*)?(?:[.．。\\u3002\\uff0e]|[：:]|[，,、])?\\s*(${TOK})`,
  'gu'
);

const RE_COMMA = new RegExp(
  `(?<!\\d)([1-9]|[1-5]\\d|60)(?!\\d)\\s*[、，,]+\\s*(${TOK})`,
  'gu'
);

const RE_TF46 = new RegExp(
  `(?<!\\d)(4[6-9]|50)(?!\\d)\\s*[.．。\\u3002\\uff0e:：；;，、]+\\s*(${TOK})`,
  'gu'
);

function ingestPair(re: RegExp, raw: string, map: Map<number, string>): void {
  let mm: RegExpExecArray | null;
  while ((mm = re.exec(raw)) !== null) {
    const n = Number(mm[1]);
    if (!Number.isFinite(n) || n < 1 || n > 60) continue;
    map.set(n, normalizeCapturedAnswer(mm[2]!, n));
  }
}

export function parseHsk2AnswerSheet(raw: string): Map<number, string> {
  const text = raw.replace(/\r\n|\r/g, '\n').normalize('NFKC');
  const map = new Map<number, string>();
  ingestPair(RE_MAIN, text, map);
  ingestPair(RE_COMMA, text, map);
  ingestPair(RE_TF46, text, map);
  patchTf46ReadingSection(text, map);
  return map;
}

export function assertFullAnswerKey(map: Map<number, string>): void {
  const missing: number[] = [];
  for (let i = 1; i <= 60; i++) if (!map.has(i)) missing.push(i);
  if (missing.length === 0) return;
  throw new Error(
    missing.length <= 10
      ? `Тохиргоо: ${missing.join(', ')} дугаар асуултын хариу олдсонгүй.`
      : `Тохиргоо: ${missing.length} асуултын хариу олдсонгүй (эхний дугаар: ${missing[0]}).`
  );
}
