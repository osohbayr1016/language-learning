import type { Word } from '../../../lib/types';

export type StrokePuzzle = {
  id: string;
  hanzi: string;
  meaning_mn: string;
  pinyin: string;
  givenPart: string;
  missingPart: string;
  options: string[];
};

export const STROKE_PUZZLES: StrokePuzzle[] = [
  {
    id: 'p1',
    hanzi: '你',
    meaning_mn: 'чи',
    pinyin: 'nǐ',
    givenPart: '尔',
    missingPart: '亻',
    options: ['亻', '彳', '人', '入'],
  },
  {
    id: 'p2',
    hanzi: '好',
    meaning_mn: 'сайн',
    pinyin: 'hǎo',
    givenPart: '子',
    missingPart: '女',
    options: ['女', '母', '安', '子'],
  },
  {
    id: 'p3',
    hanzi: '妈',
    meaning_mn: 'ээж',
    pinyin: 'mā',
    givenPart: '马',
    missingPart: '女',
    options: ['女', '母', '马', '小'],
  },
  {
    id: 'p4',
    hanzi: '爸',
    meaning_mn: 'аав',
    pinyin: 'bà',
    givenPart: '巴',
    missingPart: '父',
    options: ['父', '人', '八', '入'],
  },
  {
    id: 'p5',
    hanzi: '吃',
    meaning_mn: 'идэх',
    pinyin: 'chī',
    givenPart: '乞',
    missingPart: '口',
    options: ['口', '日', '目', '田'],
  },
  {
    id: 'p6',
    hanzi: '想',
    meaning_mn: 'бодох',
    pinyin: 'xiǎng',
    givenPart: '相',
    missingPart: '心',
    options: ['心', '必', '思', '忄'],
  },
  {
    id: 'p7',
    hanzi: '学',
    meaning_mn: 'сурах',
    pinyin: 'xué',
    givenPart: '⺍',
    missingPart: '子',
    options: ['子', '字', '学', '孩'],
  },
  {
    id: 'p8',
    hanzi: '请',
    meaning_mn: 'гуйх',
    pinyin: 'qǐng',
    givenPart: '青',
    missingPart: '讠',
    options: ['讠', '言', '亻', '阝'],
  },
];

export function shufflePuzzles<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/** Хичээлийн үг дотор байгаа ханзнуудаар тааруулсан дасгал; тохирохгүй бол бүх сан. */
export function puzzlesForLessonWords(words: Word[]): StrokePuzzle[] {
  const chars = new Set<string>();
  for (const w of words) {
    for (const ch of Array.from(w.hanzi.trim())) chars.add(ch);
  }
  const matched = STROKE_PUZZLES.filter((p) => chars.has(p.hanzi));
  return matched.length > 0 ? matched : STROKE_PUZZLES;
}
