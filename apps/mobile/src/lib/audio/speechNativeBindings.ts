import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { useNativeSpeechEvent } from './speechNative';
import type { SpeechResult, SpeechState } from './speechTypes';

export function useNativeContinuousBindings(
  clearAutoStop: () => void,
  nativeCommittedRef: MutableRefObject<string>,
  nativeLastPreviewRef: MutableRefObject<string>,
  setLiveTranscript: (s: string) => void,
  setResult: Dispatch<SetStateAction<SpeechResult | null>>,
  setErrorMessage: (s: string | null) => void,
  setState: Dispatch<SetStateAction<SpeechState>>
): void {
  useNativeSpeechEvent('start', () => {
    setState('listening');
    setErrorMessage(null);
  });
  useNativeSpeechEvent('end', () => {
    clearAutoStop();
    const t =
      nativeCommittedRef.current.trim() || nativeLastPreviewRef.current.trim();
    nativeCommittedRef.current = '';
    nativeLastPreviewRef.current = '';
    if (t) {
      setResult({ transcript: t, confidence: 0 });
      setLiveTranscript('');
      setState('idle');
    } else {
      setState((s) => (s === 'error' ? s : 'idle'));
    }
  });
  useNativeSpeechEvent('result', (event) => {
    const e = event as { isFinal: boolean; results?: SpeechResult[] };
    const top = e.results?.[0];
    if (!top?.transcript) return;
    if (e.isFinal) {
      nativeCommittedRef.current = `${nativeCommittedRef.current} ${top.transcript}`.trim();
      nativeLastPreviewRef.current = nativeCommittedRef.current;
      setLiveTranscript(nativeCommittedRef.current);
    } else {
      const preview = `${nativeCommittedRef.current} ${top.transcript}`.trim();
      nativeLastPreviewRef.current = preview;
      setLiveTranscript(preview);
    }
  });
  useNativeSpeechEvent('error', (event) => {
    clearAutoStop();
    const e = event as { error: string; message?: string };
    setErrorMessage(e.message ?? e.error);
    setState('error');
  });
}
