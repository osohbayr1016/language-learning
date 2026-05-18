import { Platform } from 'react-native';

const FONT_CSS_ID = 'chinese-learning-noto-google-font-css';

/** `+html.tsx` stylesheet — Metro web dev суурьтай анхдагч HTML-д загваргүй байх тохиолдолд CJK ханз гарахын тулд нэмнэ (export bundle-т давхардахгүй id). */
export function ensureWebHanziFonts(): void {
  if (Platform.OS !== 'web') return;
  const doc = typeof document !== 'undefined' ? document : undefined;
  if (!doc?.head || doc.getElementById(FONT_CSS_ID)) return;

  const preA = doc.createElement('link');
  preA.rel = 'preconnect';
  preA.href = 'https://fonts.googleapis.com';

  const preB = doc.createElement('link');
  preB.rel = 'preconnect';
  preB.href = 'https://fonts.gstatic.com';
  preB.setAttribute('crossorigin', 'anonymous');

  const link = doc.createElement('link');
  link.id = FONT_CSS_ID;
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;800&family=Noto+Sans+SC:wght@400;600;700&display=swap';

  doc.head.append(preA, preB, link);
}
