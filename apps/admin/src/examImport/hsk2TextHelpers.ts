export function collapseWs(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function sliceBetween(src: string, start: RegExp, end: RegExp): string {
  const a = src.search(start);
  if (a < 0) return '';
  const sub = src.slice(a);
  const b = sub.search(end);
  return b < 0 ? sub : sub.slice(0, b);
}

export function blockBetweenNum(src: string, n: number, nextNum: number | null, endMarker?: RegExp): string {
  const head = new RegExp(`${n}\\s*[．.]`);
  const i = src.search(head);
  if (i < 0) return '';
  const rest = src.slice(i);
  if (nextNum != null) {
    const tail = new RegExp(`${nextNum}\\s*[．.]`);
    const j = rest.search(tail);
    if (j > 0) return rest.slice(0, j);
  }
  if (endMarker) {
    const j = rest.search(endMarker);
    if (j > 0) return rest.slice(0, j);
  }
  return rest;
}

export function parseThreeOptions(block: string): [string, string, string] | null {
  const m = block.match(/A\s*([\s\S]*?)\s+B\s*([\s\S]*?)\s+C\s*([\s\S]*?)(?:$|(?=\d+\s*[．.]))/);
  if (!m) return null;
  return [collapseWs(m[1]!), collapseWs(m[2]!), collapseWs(m[3]!)];
}

export function extractSixLetterLabels(src: string): string[] {
  const keys = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
  const opts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const L = keys[i]!;
    const N = keys[i + 1];
    const pat = N
      ? new RegExp(`${L}\\s*([\\s\\S]*?)\\s+${N}\\s`, 'm')
      : new RegExp(`${L}\\s*([\\s\\S]*?)(?=\\s*例如|第\\s*\\d+|$)`, 'm');
    const mm = src.match(pat);
    const body = mm ? collapseWs(mm[1]!) : '';
    opts.push(body ? `${L} ${body}` : L);
  }
  return opts;
}
