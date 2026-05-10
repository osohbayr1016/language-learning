export type OnboardingLocaleCode = 'mn' | 'en' | 'zh';

export const ONBOARDING_LOCALE_CODES: OnboardingLocaleCode[] = ['mn', 'en', 'zh'];

export type OnboardingStrings = {
  appName: string;
  next: string;
  start: string;
  skip: string;
  login: string;
  signUp: string;
  stepOf: string;
  speakHanzi: string;
  s1: string;
  s2: string;
  s3: string;
};

function stepLabel(locale: OnboardingLocaleCode, step: number, total: number): string {
  if (locale === 'zh') return `第 ${step} 步，共 ${total} 步`;
  if (locale === 'en') return `Step ${step} of ${total}`;
  return `${step} / ${total} алхам`;
}

export function getOnboardingStrings(
  locale: OnboardingLocaleCode,
  step: number,
  total: number,
): OnboardingStrings {
  const base = ONBOARDING_COPY[locale];
  return { ...base, stepOf: stepLabel(locale, step, total) };
}

const ONBOARDING_COPY: Record<
  OnboardingLocaleCode,
  Omit<OnboardingStrings, 'stepOf'>
> = {
  mn: {
    appName: 'Хятад хэл',
    next: 'Дараах',
    start: 'Эхлэх',
    skip: 'Алгасах',
    login: 'Нэвтрэх',
    signUp: 'Бүртгүүлэх',
    speakHanzi: 'Хятад үгийг дуудлагаар сонсох',
    s1: 'Хүүхэлдэйн кино үзээд хятад хэл сурцгаая',
    s2: 'Тоглоом тоглож үг цээжлээрэй',
    s3: 'Өдөр бүр алгасахгүй сурахад чинь туслана',
  },
  en: {
    appName: 'Chinese',
    next: 'Next',
    start: 'Get started',
    skip: 'Skip',
    login: 'Log in',
    signUp: 'Sign up',
    speakHanzi: 'Play pronunciation for this Chinese phrase',
    s1: 'Watch cartoons and learn Chinese together',
    s2: 'Play games to memorize words',
    s3: 'Practice a little every day—we will help you stay on track',
  },
  zh: {
    appName: '汉语学习',
    next: '下一步',
    start: '开始使用',
    skip: '跳过',
    login: '登录',
    signUp: '注册',
    speakHanzi: '播放这句中文的发音',
    s1: '看动画，一起学汉语',
    s2: '玩游戏，记单词',
    s3: '每天学一点，我们帮你坚持',
  },
};
