import type { Word } from '../types';

export type SpeechPromptScope = 'word' | 'example';

export function getSpeechDisplay(word: Word, speechPrompt: SpeechPromptScope) {
  if (speechPrompt === 'example' && word.example_jp) {
    return {
      hanzi: word.example_jp,
      pinyin: word.example_romaji ?? word.romaji ?? '',
      tones: null as string | null,
    };
  }
  return {
    hanzi: word.kanji,
    pinyin: word.romaji ?? '',
    tones: null as string | null,
  };
}

export function speechRecognitionHints(word: Word, displayHanzi: string): string[] {
  return [...new Set([displayHanzi, word.kanji, word.example_jp].filter(Boolean) as string[])];
}
