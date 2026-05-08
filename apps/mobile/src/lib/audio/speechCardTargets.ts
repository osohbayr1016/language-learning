import type { Word } from '../types';

export type SpeechPromptScope = 'word' | 'example';

export function getSpeechDisplay(word: Word, speechPrompt: SpeechPromptScope) {
  if (speechPrompt === 'example' && word.example_zh) {
    return {
      hanzi: word.example_zh,
      pinyin: word.example_pinyin ?? word.pinyin ?? '',
      tones: null as string | null,
    };
  }
  return {
    hanzi: word.hanzi,
    pinyin: word.pinyin ?? '',
    tones: word.tones,
  };
}

export function speechRecognitionHints(word: Word, displayHanzi: string): string[] {
  return [...new Set([displayHanzi, word.hanzi, word.example_zh].filter(Boolean) as string[])];
}
