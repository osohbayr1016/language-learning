export type OnboardingSlide = {
  id: string;
  /** Main headline in Japanese (kanji/kana). */
  japanese: string;
  /** Romaji reading aid below the headline. */
  romaji: string;
  /** Copy key matching strings (s1, s2, s3). */
  copyKey: 's1' | 's2' | 's3';
  image: number;
};

export const slides: OnboardingSlide[] = [
  {
    id: 's1',
    japanese: 'アニメを見る',
    romaji: 'anime o miru',
    copyKey: 's1',
    image: require('../../../assets/images/onboarding-1.png'),
  },
  {
    id: 's2',
    japanese: 'ゲームで覚える',
    romaji: 'gēmu de oboeru',
    copyKey: 's2',
    image: require('../../../assets/images/onboarding-2.png'),
  },
  {
    id: 's3',
    japanese: '毎日続ける',
    romaji: 'mainichi tsuzukeru',
    copyKey: 's3',
    image: require('../../../assets/images/onboarding-3.png'),
  },
];
