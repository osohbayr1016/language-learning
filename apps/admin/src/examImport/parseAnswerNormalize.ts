export function normalizeCapturedAnswer(raw: string, qNum: number): string {
  const s = raw.trim();
  const tf = qNum <= 10 || (qNum >= 46 && qNum <= 50);

  if (tf) {
    if (/^正确/u.test(s) || s === '对' || s === '對') return '√';
    if (/^错误|^錯誤/u.test(s)) return '×';
    if (s.startsWith('不对')) return '×';
    if (s === '错' || s === '錯') return '×';
    if (/^[Tt]$/u.test(s)) return '√';
    if (/^[Ff]$/u.test(s)) return '×';
  }

  const ch = s[0];
  if (!ch) return s;
  switch (ch) {
    case '\u2713':
    case '\u2714':
    case '\u2611':
      return '√';
    case '\u2717':
    case '\u2718':
    case '\u2716':
    case '\u2715':
    case '\u274c':
      return '×';
    default:
      break;
  }
  if (/^[a-f]$/i.test(ch)) return ch.toUpperCase();
  if (ch === '√' || ch === '×') return ch;
  if (ch === '對' || ch === '对') return '√';
  if (ch === '错' || ch === '錯') return '×';
  return s;
}
