export type AuthLocaleCode = 'mn' | 'zh' | 'en';

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

const zh: AuthLocaleStrings = {
  loginTitle: '登录账户',
  loginSubtitle: '欢迎',
  registerTitle: '创建账户',
  registerSubtitle: '几秒钟即可完成',
  email: '电子邮箱',
  password: '密码',
  signIn: '登录',
  signUp: '注册',
  noAccount: '还没有账户？',
  hasAccount: '已有账户？',
  emailInvalid: '请输入有效邮箱',
  requiredEmail: '请输入邮箱',
  requiredPassword: '请输入密码',
  weakPassword: '密码至少 8 个字符',
  passwordPlaceholder: '请输入密码',
  forgotPassword: '忘记密码？',
  forgotPasswordMsg: '应用暂不支持找回密码。请联系支持或重新注册。',
  googleSoon: 'Google 登录即将推出。',
  redirectLoginRequired: '请先登录以继续。',
  signInWithGoogle: '使用 Google 登录',
  showPassword: '显示',
  hidePassword: '隐藏',
  requestFailed: '出错了，请重试',
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

export const AUTH_LOCALE_COPY: Record<AuthLocaleCode, AuthLocaleStrings> = { mn, zh, en };

export const AUTH_LOCALE_DISPLAY: Record<AuthLocaleCode, string> = {
  mn: 'Монгол',
  zh: '中文',
  en: 'English',
};
