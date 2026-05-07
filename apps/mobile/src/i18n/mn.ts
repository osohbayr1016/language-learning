import { setup } from './strings/setup';
import { lesson } from './strings/lesson';
import { insights } from './strings/insights';
import { study } from './strings/study';
import { games } from './strings/games';
import { premium } from './strings/premium';

export const mn = {
  appName: 'Хятад Хэл',
  common: {
    continue: 'Үргэлжлүүлэх',
    next: 'Дараах',
    back: 'Буцах',
    skip: 'Алгасах',
    cancel: 'Цуцлах',
    confirm: 'Тийм',
    save: 'Хадгалах',
    done: 'Дууссан',
    retry: 'Дахин оролдох',
    loading: 'Уншиж байна...',
    error: 'Алдаа гарлаа',
  },
  auth: {
    loginTitle: 'Бүртгэлдээ нэвтрэх',
    registerTitle: 'Бүртгэл үүсгэх',
    email: 'И-мэйл хаяг',
    password: 'Нууц үг',
    signIn: 'Нэвтрэх',
    signUp: 'Бүртгүүлэх',
    noAccount: 'Бүртгэлгүй юу?',
    hasAccount: 'Бүртгэлтэй юу?',
    requiredFields: 'И-мэйл болон нууц үгээ оруулна уу',
    weakPassword: 'Нууц үг доод тал нь 8 тэмдэгт байх ёстой',
  },
  onboarding: {
    s1: 'Хүүхэлдэйн кино үзээд хятад хэл сурцгаая',
    s2: 'Тоглоом тоглож үг цээжлээрэй',
    s3: 'Өдөр бүр алгасахгүй сурахад чинь туслана',
    start: 'Эхлэх',
  },
  setup,
  tabs: {
    home: 'Нүүр',
    study: 'Сурах',
    games: 'Тоглоом',
    cartoons: 'Хүүхэлдэй',
    profile: 'Профайл',
  },
  home: {
    hello: 'Сайн уу',
    streakDays: '{n} өдөр дараалан',
    dueToday: 'Өнөөдөр давтах үгс',
    dueWordsCount: '{n} үгийн давталт ирлээ',
    noDue: 'Өнөөдөр давтах үг алга — шинэ үг сурцгаая',
    quickActions: 'Шуурхай үйлдэл',
    continueStudy: 'Үргэлжлүүлэн сурах',
    leaderboard: 'Тэргүүлэгчид',
    dailyGoal: 'Өдрийн зорилго',
  },
  study,
  games,
  writer: {
    title: 'Ханзаар бичих',
    watch: 'Зураас харах',
    trace: 'Бичих',
    accuracy: 'Нарийвчлал',
    perfect: 'Гайхалтай!',
    needsWork: 'Дахин оролдоорой',
  },
  cartoons: {
    hub: 'Хүүхэлдэйн кино',
    watch: 'Үзэх',
    vocab: 'Сурах үгс',
    tapWord: 'Дэлгэцэн дээрх үг дээр дарж дуудлагыг сонсоорой',
  },
  profile: {
    edit: 'Профайл засах',
    settings: 'Тохиргоо',
    stats: 'Статистик',
    signOut: 'Гарах',
    signOutConfirm: 'Та гарахдаа итгэлтэй байна уу?',
  },
  pron: {
    tap: 'Тап: хэвийн хурдтай',
    hold: 'Удаан дарж барих: удаан',
    doubleTap: 'Хоёр дарах: 3 удаа давтах',
    slow: 'удаан',
  },
  lesson,
  insights,
  premium,
};
