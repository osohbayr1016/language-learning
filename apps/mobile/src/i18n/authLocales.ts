export type AuthLocaleCode = 'mn' | 'ja' | 'en';

export type AuthLocaleStrings = {
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  email: string;
  password: string;
  signIn: string;
  signUp: string;
  noAccount: string;
  hasAccount: string;
  emailInvalid: string;
  requiredEmail: string;
  requiredPassword: string;
  weakPassword: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  forgotPasswordMsg: string;
  googleSoon: string;
  redirectLoginRequired: string;
  signInWithGoogle: string;
  showPassword: string;
  hidePassword: string;
  requestFailed: string;
};

const mn: AuthLocaleStrings = {
  loginTitle: 'Бүртгэлдээ нэвтрэх',
  loginSubtitle: 'Тавтай морил',
  registerTitle: 'Бүртгэл үүсгэх',
  registerSubtitle: 'Хэдэн секундэд бэлэн боллоо',
  email: 'И-мэйл хаяг',
  password: 'Нууц үг',
  signIn: 'Нэвтрэх',
  signUp: 'Бүртгүүлэх',
  noAccount: 'Бүртгэлгүй юу?',
  hasAccount: 'Бүртгэлтэй юу?',
  emailInvalid: 'Зөв и-мэйл хаяг оруулна уу',
  requiredEmail: 'И-мэйл оруулна уу',
  requiredPassword: 'Нууц үг оруулна уу',
  weakPassword: 'Нууц үг дор хаяж 8 тэмдэгт байх ёстой',
  passwordPlaceholder: 'Нууц үг оруулна уу',
  forgotPassword: 'Нууц үгээ мартсан уу?',
  forgotPasswordMsg:
    'Нууц үг сэргээх одоогоор апп дээр боломжгүй. Дахин бүртгэл үүсгэх эсвэл дэмжлэгтэй холбогдоно уу.',
  googleSoon: 'Google-ээр нэвтрэх удахгүй нэмэгдэнэ.',
  redirectLoginRequired: 'Үргэлжлүүлэхийн тулд нэвтэрнэ үү.',
  signInWithGoogle: 'Google-ээр нэвтрэх',
  showPassword: 'Харуулах',
  hidePassword: 'Нуух',
  requestFailed: 'Алдаа гарлаа',
};

const ja: AuthLocaleStrings = {
  loginTitle: 'ログイン',
  loginSubtitle: 'おかえりなさい',
  registerTitle: 'アカウントを作成',
  registerSubtitle: 'すぐに始められます',
  email: 'メールアドレス',
  password: 'パスワード',
  signIn: 'ログイン',
  signUp: '新規登録',
  noAccount: 'アカウントをお持ちでないですか？',
  hasAccount: 'すでに登録済みですか？',
  emailInvalid: '有効なメールアドレスを入力してください',
  requiredEmail: 'メールアドレスを入力してください',
  requiredPassword: 'パスワードを入力してください',
  weakPassword: 'パスワードは8文字以上にしてください',
  passwordPlaceholder: 'パスワードを入力',
  forgotPassword: 'パスワードをお忘れですか？',
  forgotPasswordMsg:
    'パスワードの再設定はアプリではまだ利用できません。サポートへ連絡するか、新規登録してください。',
  googleSoon: 'Google でのログインは近日対応予定です。',
  redirectLoginRequired: '続行するにはログインしてください。',
  signInWithGoogle: 'Google で続行',
  showPassword: '表示',
  hidePassword: '非表示',
  requestFailed: 'エラーが発生しました。もう一度お試しください。',
};

const en: AuthLocaleStrings = {
  loginTitle: 'Log in',
  loginSubtitle: 'Welcome back',
  registerTitle: 'Create account',
  registerSubtitle: 'Ready in seconds',
  email: 'Email',
  password: 'Password',
  signIn: 'Log in',
  signUp: 'Sign up',
  noAccount: 'No account?',
  hasAccount: 'Already registered?',
  emailInvalid: 'Enter a valid email address',
  requiredEmail: 'Email is required',
  requiredPassword: 'Password is required',
  weakPassword: 'Password must be at least 8 characters',
  passwordPlaceholder: 'Enter your password',
  forgotPassword: 'Forgot password?',
  forgotPasswordMsg:
    'Password reset is not available in the app yet. Contact support or create a new account.',
  googleSoon: 'Sign in with Google is coming soon.',
  redirectLoginRequired: 'Please log in to continue.',
  signInWithGoogle: 'Continue with Google',
  showPassword: 'Show',
  hidePassword: 'Hide',
  requestFailed: 'Something went wrong',
};

export const AUTH_LOCALE_COPY: Record<AuthLocaleCode, AuthLocaleStrings> = { mn, ja, en };

export const AUTH_LOCALE_DISPLAY: Record<AuthLocaleCode, string> = {
  mn: 'Монгол',
  ja: '日本語',
  en: 'English',
};
