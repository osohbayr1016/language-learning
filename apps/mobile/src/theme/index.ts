// Design tokens for the Chinese Learning App
// Based on Elera UI Kit — dark mode

export const colors = {
  // Backgrounds
  bg: {
    primary: '#0F0F1A',
    secondary: '#1A1A2E',
    card: '#16213E',
    elevated: '#1E1E35',
    input: '#252540',
  },

  // Brand gradient colors
  accent: {
    purple: '#7C3AED',
    blue: '#3B82F6',
    teal: '#06B6D4',
    pink: '#EC4899',
  },

  // Tone colors (standard Chinese linguistics)
  tone: {
    1: '#EF4444', // First tone — red (flat)
    2: '#F59E0B', // Second tone — amber (rising)
    3: '#10B981', // Third tone — green (dipping)
    4: '#3B82F6', // Fourth tone — blue (falling)
    0: '#6B7280', // Neutral tone — gray
  },

  // HSK level colors
  hsk: {
    1: '#10B981',
    2: '#3B82F6',
    3: '#7C3AED',
    4: '#F59E0B',
    5: '#EF4444',
    6: '#EC4899',
  },

  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#475569',
    inverse: '#0F172A',
  },

  // Status
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Borders
  border: '#2D2D4A',
  borderLight: '#3D3D5A',

  // Overlay
  overlay: 'rgba(0,0,0,0.7)',
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
  // Hanzi (Chinese characters)
  hanzi: {
    xl: { fontSize: 72, fontWeight: '300' as const, letterSpacing: 4 },
    lg: { fontSize: 48, fontWeight: '300' as const, letterSpacing: 2 },
    md: { fontSize: 32, fontWeight: '400' as const },
    sm: { fontSize: 24, fontWeight: '400' as const },
  },
  // Pinyin
  pinyin: {
    lg: { fontSize: 20, letterSpacing: 2 },
    md: { fontSize: 16, letterSpacing: 1 },
    sm: { fontSize: 13, letterSpacing: 0.5 },
  },
  // UI text
  heading: {
    xl: { fontSize: 28, fontWeight: '700' as const },
    lg: { fontSize: 22, fontWeight: '700' as const },
    md: { fontSize: 18, fontWeight: '600' as const },
    sm: { fontSize: 15, fontWeight: '600' as const },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  }),
};
