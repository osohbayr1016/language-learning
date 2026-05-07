import { useEffect, useState } from 'react';

export type SpeechState = 'idle' | 'requesting' | 'listening' | 'processing' | 'error';
export type SpeechResult = { transcript: string; confidence: number };

type EventName = 'start' | 'end' | 'result' | 'error';
type EventHook = (name: EventName, cb: (event: unknown) => void) => void;

let mod: typeof import('expo-speech-recognition') | null = null;
let loadError: string | null = null;

try {
  // Lazy require so Expo Go (which can't link the native module) doesn't crash at import time.
  mod = require('expo-speech-recognition');
} catch (e) {
  loadError = e instanceof Error ? e.message : String(e);
}

export const SPEECH_SUPPORTED = !!mod?.ExpoSpeechRecognitionModule;

const noopHook: EventHook = () => {};
const useEvt: EventHook = SPEECH_SUPPORTED
  ? (mod!.useSpeechRecognitionEvent as unknown as EventHook)
  : noopHook;

export async function ensureSpeechPermission(): Promise<boolean> {
  if (!SPEECH_SUPPORTED || !mod) return false;
  try {
    const current = await mod.ExpoSpeechRecognitionModule.getPermissionsAsync();
    if (current.granted) return true;
    const next = await mod.ExpoSpeechRecognitionModule.requestPermissionsAsync();
    return !!next.granted;
  } catch {
    return false;
  }
}

export function startChineseRecognition(contextual?: string[]): void {
  if (!SPEECH_SUPPORTED || !mod) return;
  mod.ExpoSpeechRecognitionModule.start({
    lang: 'zh-CN',
    interimResults: false,
    maxAlternatives: 3,
    continuous: false,
    contextualStrings: contextual,
    requiresOnDeviceRecognition: false,
  });
}

export function stopRecognition(): void {
  if (!SPEECH_SUPPORTED || !mod) return;
  try { mod.ExpoSpeechRecognitionModule.stop(); } catch { /* ignore */ }
}

export function abortRecognition(): void {
  if (!SPEECH_SUPPORTED || !mod) return;
  try { mod.ExpoSpeechRecognitionModule.abort(); } catch { /* ignore */ }
}

export function useSpeechSession() {
  const [state, setState] = useState<SpeechState>('idle');
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(loadError);

  useEvt('start', () => { setState('listening'); setErrorMessage(null); });
  useEvt('end', () => { setState((s) => (s === 'error' ? s : 'idle')); });
  useEvt('result', (event) => {
    const e = event as { isFinal: boolean; results?: SpeechResult[] };
    if (!e.isFinal) return;
    const top = e.results?.[0];
    if (top) setResult({ transcript: top.transcript, confidence: top.confidence });
    setState('processing');
  });
  useEvt('error', (event) => {
    const e = event as { error: string; message?: string };
    setErrorMessage(e.message ?? e.error);
    setState('error');
  });

  useEffect(() => () => abortRecognition(), []);

  const reset = () => { setResult(null); setErrorMessage(null); setState('idle'); };

  return { state, result, errorMessage, reset, supported: SPEECH_SUPPORTED };
}
