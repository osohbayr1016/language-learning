export type OnboardingSlide = {
  id: string;
  hanzi: string;
  pinyin: string;
  /** Copy key matching strings (s1, s2, s3). */
  copyKey: 's1' | 's2' | 's3';
  image: number;
};

export const slides: OnboardingSlide[] = [
  {
    id: 's1',
    hanzi: '看动画',
    pinyin: 'kàn dònghuà',
    copyKey: 's1',
    image: require('../../../assets/images/onboarding-1.png'),
  },
  {
    id: 's2',
    hanzi: '玩游戏',
    pinyin: 'wán yóuxì',
    copyKey: 's2',
    image: require('../../../assets/images/onboarding-2.png'),
  },
  {
    id: 's3',
    hanzi: '每天学',
    pinyin: 'měitiān xué',
    copyKey: 's3',
    image: require('../../../assets/images/onboarding-3.png'),
  },
];
