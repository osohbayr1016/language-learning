import { Platform } from 'react-native';

/** expo / RN вэб: DOM types ашиглагүйгээр түлхүүр. */
export type WebStudyKeyEvt = {
  code?: string;
  key?: string;
  readonly target?: unknown;
  preventDefault(): void;
};

export type WebStudyKeyHandler = (e: WebStudyKeyEvt) => void;

export function attachWebStudyKeydown(handler: WebStudyKeyHandler): (() => void) | undefined {
  if (Platform.OS !== 'web') return undefined;
  const gw = globalThis as unknown as {
    window?: { addEventListener: (t: string, h: (e: WebStudyKeyEvt) => void) => void; removeEventListener: (t: string, h: (e: WebStudyKeyEvt) => void) => void };
  };
  const w = gw.window;
  if (!w) return undefined;
  const fn = handler;
  w.addEventListener('keydown', fn as (e: WebStudyKeyEvt) => void);
  return () => w.removeEventListener('keydown', fn as (e: WebStudyKeyEvt) => void);
}

function closestSupported(target: unknown): target is { closest: (sel: string) => unknown } {
  return (
    !!target &&
    typeof target === 'object' &&
    'closest' in target &&
    typeof (target as { closest?: unknown }).closest === 'function'
  );
}

export function webKeyEventIsEditingField(ev: WebStudyKeyEvt): boolean {
  const raw = ev.target;
  let t: unknown = raw;
  if (closestSupported(raw)) {
    try {
      return Boolean(raw.closest('input, textarea, select, [contenteditable="true"]'));
    } catch {
      /* ignore selector issues */
    }
  }
  for (let i = 0; i < 4 && t && typeof t === 'object'; i++) {
    const cur = t as Record<string, unknown>;
    const tag = typeof cur.tagName === 'string' ? cur.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
    if (cur.isContentEditable === true) return true;
    t = cur.parent ?? cur.parentElement;
  }
  return false;
}
