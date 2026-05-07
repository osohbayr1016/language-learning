import { colors } from '../theme';
import type { Tone } from './types';

export function getToneColor(tone: number | undefined | null): string {
  if (tone === 1) return colors.tone[1];
  if (tone === 2) return colors.tone[2];
  if (tone === 3) return colors.tone[3];
  if (tone === 4) return colors.tone[4];
  return colors.tone[0];
}

export function parseTones(tonesStr: string | null | undefined): Tone[] {
  if (!tonesStr) return [];
  try {
    const arr = JSON.parse(tonesStr);
    if (!Array.isArray(arr)) return [];
    return arr.map((n) => (typeof n === 'number' ? (n as Tone) : 0));
  } catch {
    return [];
  }
}

export function stripToneMarks(pinyin: string): string {
  return pinyin
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s/g, '');
}

const TONE_LABEL_MN: Record<number, string> = {
  1: 'Тэгш',
  2: 'Өсөх',
  3: 'Уруудан өсөх',
  4: 'Бууж',
  0: 'Сул',
};

export function toneLabel(tone: number | undefined | null): string {
  return TONE_LABEL_MN[tone ?? 0] ?? TONE_LABEL_MN[0];
}
