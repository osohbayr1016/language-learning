import { normalizeCapturedAnswer } from './parseAnswerNormalize';

const MARK_CHUNK =
  '正确|错误|錯誤|不对|√|×|[\\u2713\\u2714\\u2611\\u2715\\u2716\\u2717\\u274c對对錯错]|[TFtf]';

const RE_TF_HDR =
  /(?:第\s*)?46(?:\s|[~～〜－\-—–\u2013\u2014\uFF0D至到])+\s*50\s*(?:题|題)|46\s*[、，,/／]+\s*50\s*(?:题|題)|(?:第\s*)?46\s*至\s*50\s*(?:题|題)\s*[：:]?/mu;

const RE_TF_HDR_FALLBACK = /第三部分|阅读理解|阅读\s*[（(]?三[）)]?|第\s*[三四]\s*部\s*分/;

function tfMissing(map: Map<number, string>): number[] {
  return [46, 47, 48, 49, 50].filter((q) => !map.has(q));
}

function backfillMarkedLine(tail: string, map: Map<number, string>): boolean {
  const markRe = new RegExp(MARK_CHUNK, 'gu');
  for (const line of tail.split('\n')) {
    markRe.lastIndex = 0;
    const marks: string[] = [];
    let mx: RegExpExecArray | null;
    while ((mx = markRe.exec(line)) !== null && marks.length < 12) {
      marks.push(normalizeCapturedAnswer(mx[0]!, 46 + marks.length));
    }
    if (marks.length < 5) continue;
    for (let i = 0; i < 5; i++) {
      const q = 46 + i;
      if (!map.has(q)) map.set(q, marks[i]!);
    }
    return true;
  }
  markRe.lastIndex = 0;
  const picks: string[] = [];
  let m2: RegExpExecArray | null;
  while ((m2 = markRe.exec(tail)) !== null && picks.length < 5) {
    picks.push(normalizeCapturedAnswer(m2[0]!, 46 + picks.length));
  }
  if (picks.length < 5) return false;
  for (let i = 0; i < 5; i++) {
    const q = 46 + i;
    if (!map.has(q)) map.set(q, picks[i]!);
  }
  return true;
}

function sliceAfterTfHeader(full: string): string | null {
  RE_TF_HDR.lastIndex = 0;
  RE_TF_HDR_FALLBACK.lastIndex = 0;
  let hit = RE_TF_HDR.exec(full);
  if (hit == null) hit = RE_TF_HDR_FALLBACK.exec(full);
  if (hit == null) return null;
  return full.slice(hit.index + hit[0].length, hit.index + hit[0].length + 1200);
}

function recoverPerNumber(full: string, map: Map<number, string>): void {
  const mc = '(' + MARK_CHUNK + ')';
  for (let n = 46; n <= 50; n++) {
    if (map.has(n)) continue;
    const r1 = new RegExp(
      `(?<!\\d)${n}(?!\\d)\\s*(?:题|題)?\\s*[\\s.,．。\\u3001\\u3002:：;,，、]{0,24}?${mc}`,
      'u'
    );
    let h = r1.exec(full);
    if (h?.[1]) {
      map.set(n, normalizeCapturedAnswer(h[1], n));
      continue;
    }
    const r2 = new RegExp(
      `第\\s*${n}\\s*(?:题|題)(?:[\\s\\S]{0,360}?${mc})`,
      'isu'
    );
    h = r2.exec(full);
    if (h?.[1]) map.set(n, normalizeCapturedAnswer(h[1], n));
  }
}

function findQuestion51Anchor(full: string): number {
  const hits = [
    full.search(/第\s*51\s*(?:题|題)/u),
    full.search(/(?<!\d)51(?!\d)\s*(?:题|題)?[\s.:：.;；、，.]?/u),
  ].filter((i) => i >= 0);
  return hits.length ? Math.min(...hits) : -1;
}

function stealMarksBeforeQuestion51(full: string, map: Map<number, string>): void {
  const m51 = findQuestion51Anchor(full);
  if (m51 < 4) return;
  const slab = full.slice(Math.max(0, m51 - 1200), m51);
  const lines = slab.split('\n');
  for (let li = lines.length - 1; li >= 0; li--) {
    const line = lines[li]!;
    const re = new RegExp(MARK_CHUNK, 'gu');
    re.lastIndex = 0;
    const seq: string[] = [];
    let mx: RegExpExecArray | null;
    while ((mx = re.exec(line)) !== null && seq.length < 12) {
      seq.push(normalizeCapturedAnswer(mx[0]!, 46 + seq.length));
    }
    if (seq.length < 5) continue;
    const head = seq.slice(0, 5);
    if (head.some((x) => x !== '√' && x !== '×')) continue;
    for (let i = 0; i < 5; i++) {
      const q = 46 + i;
      if (!map.has(q)) map.set(q, head[i]!);
    }
    return;
  }
}

export function patchTf46ReadingSection(full: string, map: Map<number, string>): void {
  if (tfMissing(map).length === 0) return;

  recoverPerNumber(full, map);
  stealMarksBeforeQuestion51(full, map);
  if (tfMissing(map).length === 0) return;

  const tailHdr = sliceAfterTfHeader(full);
  if (tailHdr) {
    let tail = tailHdr;
    const exParts = tail.split(/例如\s*[：:]/);
    if (exParts.length > 1) tail = exParts.at(-1)!.trim();
    if (backfillMarkedLine(tail, map)) return;
    const stripped = tailHdr.replace(/例如\s*[：:][^\n]*/gm, '').trim();
    if (backfillMarkedLine(stripped, map)) return;
  }

  recoverPerNumber(full, map);
  stealMarksBeforeQuestion51(full, map);
}
