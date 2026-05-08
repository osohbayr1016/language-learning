/** NFC + collapse internal whitespace for Chinese comparison. */
export function zhNorm(s: string): string {
  return s.normalize('NFC').trim().replace(/\s+/g, '');
}

const HAN_ONE: RegExp = (() => {
  try {
    return new RegExp('\\p{Script=Han}', 'u');
  } catch {
    return /[\u2e80-\u9fff\uf900-\ufaff]/;
  }
})();

const HAN_STRIP: RegExp = (() => {
  try {
    return new RegExp('\\p{Script=Han}', 'gu');
  } catch {
    return /[\u2e80-\u9fff\uf900-\ufaff]/g;
  }
})();

export function isHanChar(ch: string): boolean {
  return HAN_ONE.test(ch);
}

export function extractHanChars(spokenNorm: string): string[] {
  return Array.from(spokenNorm.replace(/\s+/g, '')).filter(isHanChar);
}

/** Remove Han characters so syllables() only sees romanization. */
export function stripHanForRomanization(raw: string): string {
  return raw.normalize('NFC').replace(HAN_STRIP, ' ');
}
