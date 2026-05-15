import { sansFontFamily } from './fontFamily';

const F = sansFontFamily ? ({ fontFamily: sansFontFamily } as const) : {};

export const colors = {
  bg: {
    primary: '#FFFFFF',
    secondary: '#F7F7F7',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    input: '#FFFFFF',
  },

  accent: {
    purple: '#A560E8',
    blue: '#85B2B8', // Muted Teal
    teal: '#06B6D4',
    pink: '#FEE4D1', // Cherry Blossom Pink
    green: '#E39AC1', // Red Plum
    amber: '#FFC800',
  },

  brand: {
    primary: '#E39AC1', // Red Plum
    primaryDark: '#C77BA3',
    primaryShadow: '#C77BA3',
    secondary: '#85B2B8', // Muted Teal
  },

  tone: {
    1: '#FEE4D1', // Cherry Blossom Pink
    2: '#FF9600',
    3: '#E39AC1', // Red Plum
    4: '#85B2B8', // Muted Teal
    0: '#AFAFAF',
  },

  jlpt: {
    1: '#FEE4D1', // N5 - Cherry Blossom Pink
    2: '#85B2B8', // N4 - Muted Teal
    3: '#E39AC1', // N3 - Red Plum
    4: '#A560E8', // N2 - Purple
    5: '#FF9600', // N1 - Orange
  },

  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  success: '#E39AC1', // Red Plum
  error: '#FF4B4B',
  warning: '#FF9600',
  info: '#85B2B8', // Muted Teal

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
  kanji: {
    xl: { fontSize: 88, fontWeight: '300' as const, letterSpacing: 4, ...F },
    lg: { fontSize: 64, fontWeight: '300' as const, letterSpacing: 2, ...F },
    md: { fontSize: 40, fontWeight: '400' as const, ...F },
    sm: { fontSize: 28, fontWeight: '400' as const, ...F },
  },
  /** @deprecated Use `kanji` — kept for legacy imports */
  hanzi: {
    xl: { fontSize: 88, fontWeight: '300' as const, letterSpacing: 4, ...F },
    lg: { fontSize: 64, fontWeight: '300' as const, letterSpacing: 2, ...F },
    md: { fontSize: 40, fontWeight: '400' as const, ...F },
    sm: { fontSize: 28, fontWeight: '400' as const, ...F },
  },
  romaji: {
    lg: { fontSize: 22, letterSpacing: 2, ...F },
    md: { fontSize: 18, letterSpacing: 1, ...F },
    sm: { fontSize: 14, letterSpacing: 0.5, ...F },
  },
  /** @deprecated Use `romaji` */
  pinyin: {
    lg: { fontSize: 22, letterSpacing: 2, ...F },
    md: { fontSize: 18, letterSpacing: 1, ...F },
    sm: { fontSize: 14, letterSpacing: 0.5, ...F },
  },
  heading: {
    xl: { fontSize: 30, fontWeight: '800' as const, ...F },
    lg: { fontSize: 24, fontWeight: '800' as const, ...F },
    md: { fontSize: 18, fontWeight: '700' as const, ...F },
    sm: { fontSize: 15, fontWeight: '700' as const, ...F },
  },
  body: {
    lg: { fontSize: 16, lineHeight: 24, ...F },
    md: { fontSize: 14, lineHeight: 21, ...F },
    sm: { fontSize: 12, lineHeight: 18, ...F },
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
  hero: ['#E39AC1', '#85B2B8'] as const,
  flame: ['#FF9600', '#FEE4D1'] as const,
  success: ['#E39AC1', '#FEE4D1'] as const,
};

/** Web `AppShell`: centered phone-width column for the whole app (including `/admin`). */
export const layout = {
  phoneWebMaxWidth: 430,
} as const;
