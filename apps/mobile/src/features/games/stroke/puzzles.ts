export type StrokePuzzle = {
  id: string;
  kanji: string;
  meaning_mn: string;
  romaji: string;
  givenPart: string;
  missingPart: string;
  options: string[];
};

/** Radical-choice drills (shared CJK components; same mechanic as before). */
export const STROKE_PUZZLES: StrokePuzzle[] = [
  {
    id: 'p1',
    kanji: '休',
    meaning_mn: 'амрах',
    romaji: 'kyū',
    givenPart: '木',
    missingPart: '亻',
    options: ['亻', '彳', '人', '入'],
  },
  {
    id: 'p2',
    kanji: '明',
    meaning_mn: 'гэрэл, маргааш',
    romaji: 'mei / ashita',
    givenPart: '月',
    missingPart: '日',
    options: ['日', '目', '白', '曰'],
  },
  {
    id: 'p3',
    kanji: '好',
    meaning_mn: 'дуртай, сайн',
    romaji: 'kō / ii',
    givenPart: '子',
    missingPart: '女',
    options: ['女', '母', '安', '妹'],
  },
  {
    id: 'p4',
    kanji: '男',
    meaning_mn: 'эрэгтэй',
    romaji: 'dan',
    givenPart: '力',
    missingPart: '田',
    options: ['田', '力', '土', '由'],
  },
  {
    id: 'p5',
    kanji: '語',
    meaning_mn: 'хэл, үг',
    romaji: 'go',
    givenPart: '吾',
    missingPart: '言',
    options: ['言', '口', '讠', '音'],
  },
  {
    id: 'p6',
    kanji: '間',
    meaning_mn: 'завсар, хооронд',
    romaji: 'ma / aida',
    givenPart: '日',
    missingPart: '門',
    options: ['門', '間', '開', '閉'],
  },
];

export function shufflePuzzles<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
