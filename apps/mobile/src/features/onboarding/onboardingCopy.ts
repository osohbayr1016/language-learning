export type OnboardingLocaleCode = 'mn' | 'en' | 'ja';

export const ONBOARDING_LOCALE_CODES: OnboardingLocaleCode[] = ['mn', 'en', 'ja'];

export type OnboardingStrings = {
  appName: string;
  next: string;
  start: string;
  skip: string;
  login: string;
  signUp: string;
  stepOf: string;
  speakJapanese: string;
  s1: string;
  s2: string;
  s3: string;
};

function stepLabel(locale: OnboardingLocaleCode, step: number, total: number): string {
  if (locale === 'ja') return `${step} / ${total} ステップ`;
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
    appName: 'Япон Хэл',
    next: 'Дараах',
    start: 'Эхлэх',
    skip: 'Алгасах',
    login: 'Нэвтрэх',
    signUp: 'Бүртгүүлэх',
    speakJapanese: 'Япон үгийг дуудлагаар сонсох',
    s1: 'Аниме үзээд япон хэл сурцгаая',
    s2: 'Тоглоом тоглож үг цээжлээрэй',
    s3: 'Өдөр бүр алгасахгүй сурахад чинь туслана',
  },
  en: {
    appName: 'Japanese',
    next: 'Next',
    start: 'Get started',
    skip: 'Skip',
    login: 'Log in',
    signUp: 'Sign up',
    speakJapanese: 'Play pronunciation for this Japanese phrase',
    s1: 'Watch anime and learn Japanese together',
    s2: 'Play games to memorize words',
    s3: 'Practice a little every day—we will help you stay on track',
  },
  ja: {
    appName: '日本語',
    next: '次へ',
    start: 'はじめる',
    skip: 'スキップ',
    login: 'ログイン',
    signUp: '新規登録',
    speakJapanese: 'このフレーズの音声を再生',
    s1: 'アニメを見て、一緒に日本語を学びましょう',
    s2: 'ゲームで単語を覚えましょう',
    s3: '毎日続けられるようサポートします',
  },
};
