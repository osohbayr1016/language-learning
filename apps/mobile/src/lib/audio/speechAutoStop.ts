import type { MutableRefObject } from 'react';

export const SPEECH_SESSION_MAX_MS = 5000;

export function armSpeechAutoStop(
  ref: MutableRefObject<ReturnType<typeof setTimeout> | null>,
  clear: () => void,
  stopListening: () => void
): void {
  clear();
  ref.current = setTimeout(() => stopListening(), SPEECH_SESSION_MAX_MS);
}
