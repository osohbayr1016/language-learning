export const colors = {
  bg: {
    primary: '#FFFFFF',
    secondary: '#F7F7F7',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    input: '#FFFFFF',
  },

  accent: {
    purple: '#58CC02',
    blue: '#1CB0F6',
    teal: '#06B6D4',
    pink: '#FF4B4B',
    green: '#58CC02',
    amber: '#FFC800',
  },

  brand: {
    primary: '#58CC02',
    primaryDark: '#46A302',
    primaryShadow: '#46A302',
    secondary: '#1CB0F6',
  },

  tone: {
    1: '#FF4B4B',
    2: '#FF9600',
    3: '#58CC02',
    4: '#1CB0F6',
    0: '#AFAFAF',
  },

  hsk: {
    1: '#58CC02',
    2: '#1CB0F6',
    3: '#A560E8',
    4: '#FF9600',
    5: '#FF4B4B',
    6: '#CE82FF',
  },

  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  success: '#58CC02',
  error: '#FF4B4B',
  warning: '#FF9600',
  info: '#1CB0F6',

  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  overlay: 'rgba(0,0,0,0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  hanzi: {
    xl: { fontSize: 88, fontWeight: '300' as const, letterSpacing: 4 },
    lg: { fontSize: 64, fontWeight: '300' as const, letterSpacing: 2 },
    md: { fontSize: 40, fontWeight: '400' as const },
    sm: { fontSize: 28, fontWeight: '400' as const },
  },
  pinyin: {
    lg: { fontSize: 22, letterSpacing: 2 },
    md: { fontSize: 18, letterSpacing: 1 },
    sm: { fontSize: 14, letterSpacing: 0.5 },
  },
  heading: {
    xl: { fontSize: 30, fontWeight: '800' as const },
    lg: { fontSize: 24, fontWeight: '800' as const },
    md: { fontSize: 18, fontWeight: '700' as const },
    sm: { fontSize: 15, fontWeight: '700' as const },
  },
  body: {
    lg: { fontSize: 16, lineHeight: 24 },
    md: { fontSize: 14, lineHeight: 21 },
    sm: { fontSize: 12, lineHeight: 18 },
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  }),
};

export const gradients = {
  hero: ['#58CC02', '#1CB0F6'] as const,
  flame: ['#FF9600', '#FF4B4B'] as const,
  success: ['#58CC02', '#06B6D4'] as const,
};
