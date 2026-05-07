import { mn } from '../../i18n/mn';

export type OnboardingSlide = {
  id: string;
  hanzi: string;
  pinyin: string;
  title: string;
  image: number;
};

export const slides: OnboardingSlide[] = [
  {
    id: 's1',
    hanzi: '看动画',
    pinyin: 'kàn dònghuà',
    title: mn.onboarding.s1,
    image: require('../../../assets/images/onboarding-1.png'),
  },
  {
    id: 's2',
    hanzi: '玩游戏',
    pinyin: 'wán yóuxì',
    title: mn.onboarding.s2,
    image: require('../../../assets/images/onboarding-2.png'),
  },
  {
    id: 's3',
    hanzi: '每天学',
    pinyin: 'měitiān xué',
    title: mn.onboarding.s3,
    image: require('../../../assets/images/onboarding-3.png'),
  },
];
