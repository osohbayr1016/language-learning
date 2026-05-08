import { stripToneMarks } from '../tones';
import {
  alignTargetCharScores,
  levenshteinChars,
  syllableRanges,
  weightedPinyinRatio,
} from './speechScoringAlign';
import { extractHanChars, stripHanForRomanization, zhNorm } from './speechScoringNormalize';

function syllables(py: string): string[] {
  const s = stripToneMarks(py);
  return s.match(/[a-zü]+/gi)?.map((t) => t.toLowerCase()) ?? [];
}

function lcsLen(a: string[], b: string[]): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

function syllableDice(spoken: string[], target: string[]): number {
  if (target.length === 0) return spoken.length === 0 ? 1 : 0;
  if (spoken.length === 0) return 0;
  const l = lcsLen(spoken, target);
  return (2 * l) / (spoken.length + target.length);
}

export type CharSpeakGrade = {
  char: string;
  scorePercent: number;
  pinyinPart: string;
};

export type UtteranceScore = {
  ratio: number;
  points: number;
  pass: boolean;
  hanziRatio: number;
  pinyinRatio: number;
  charGrades: CharSpeakGrade[];
  finalPercent: number;
};

export function scoreMandarinUtterance(
  spokenRaw: string,
  targetZh: string,
  targetPinyinRaw: string
): UtteranceScore {
  const spoken = spokenRaw.normalize('NFC').trim();
  const targetChars = Array.from(zhNorm(targetZh));
  const spokenHanChars = extractHanChars(spoken);
  const spokenCjk = spokenHanChars.join('');

  const targetTok = syllables(targetPinyinRaw);
  const spokenTok = syllables(stripHanForRomanization(spokenRaw));

  const maxLen = Math.max(spokenHanChars.length, targetChars.length, 1);
  const hanziRatio =
    !targetChars.length || !spokenCjk
      ? 0
      : 1 - levenshteinChars(spokenHanChars, targetChars) / maxLen;

  const charScores = targetChars.length ? alignTargetCharScores(spokenHanChars, targetChars) : [];
  const ranges = syllableRanges(targetTok.length, targetChars.length);
  const nC = targetChars.length;

  const meanChar = nC === 0 ? 0 : charScores.reduce((a, b) => a + b, 0) / nC;

  let pinyinRatio = 0;
  if (targetTok.length === 0) pinyinRatio = meanChar;
  else if (spokenTok.length > 0) pinyinRatio = syllableDice(spokenTok, targetTok);
  else pinyinRatio = weightedPinyinRatio(charScores, ranges, targetTok.length);

  const seqSim =
    !targetChars.length || !spokenCjk
      ? 0
      : 1 - levenshteinChars(spokenHanChars, targetChars) / maxLen;

  const hasCjk = spokenCjk.length > 0;
  let ratio: number;
  if (hasCjk && nC > 0) {
    const charSeq = 0.5 * meanChar + 0.5 * seqSim;
    ratio =
      spokenTok.length > 0 && targetTok.length > 0
        ? Math.max(charSeq, pinyinRatio * 0.84)
        : charSeq;
  } else if (spokenTok.length > 0 && targetTok.length > 0) {
    ratio = Math.max(pinyinRatio, hanziRatio * 0.48);
  } else {
    ratio = 0;
  }

  const points = Math.max(0, Math.min(100, Math.round(ratio * 100)));
  const pass = ratio >= 0.62;

  const charGrades: CharSpeakGrade[] = targetChars.map((ch, j) => {
    const [a, b] = ranges[j] ?? [0, 0];
    const slice = targetTok.slice(a, b);
    return {
      char: ch,
      scorePercent: Math.round((charScores[j] ?? 0) * 100),
      pinyinPart: slice.join(' '),
    };
  });

  return {
    ratio,
    points,
    pass,
    hanziRatio,
    pinyinRatio,
    charGrades,
    finalPercent: points,
  };
}
