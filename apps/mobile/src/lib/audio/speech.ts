import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  nativeAbort,
  nativeEnsurePermission,
  nativeStart,
  nativeStop,
  SPEECH_SUPPORTED,
} from './speechNative';
import { useNativeContinuousBindings } from './speechNativeBindings';
import { armSpeechAutoStop } from './speechAutoStop';
import {
  ensureWebMicAccess,
  startWebContinuousSession,
  webSpeechAvailable,
  type WebRecHandle,
} from './speechWeb';
import type { SpeechResult, SpeechState } from './speechTypes';

export type { SpeechResult, SpeechState } from './speechTypes';

export const SPEECH_CLIENT_SUPPORTED =
  SPEECH_SUPPORTED || (Platform.OS === 'web' && webSpeechAvailable());

export async function ensureSpeechPermission(): Promise<boolean> {
  if (SPEECH_SUPPORTED) return nativeEnsurePermission();
  if (Platform.OS === 'web' && webSpeechAvailable()) return ensureWebMicAccess();
  return false;
}

export function useSpeechSession() {
  const [state, setState] = useState<SpeechState>('idle');
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const webRec = useRef<WebRecHandle | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nativeCommittedRef = useRef('');
  const nativeLastPreviewRef = useRef('');

  const clearAutoStop = useCallback(() => {
    if (autoTimerRef.current != null) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  useNativeContinuousBindings(
    clearAutoStop,
    nativeCommittedRef,
    nativeLastPreviewRef,
    setLiveTranscript,
    setResult,
    setErrorMessage,
    setState
  );

  useEffect(
    () => () => {
      clearAutoStop();
      webRec.current?.abort();
      webRec.current = null;
      nativeAbort();
    },
    [clearAutoStop]
  );

  const reset = useCallback(() => {
    clearAutoStop();
    nativeCommittedRef.current = '';
    nativeLastPreviewRef.current = '';
    setResult(null);
    setLiveTranscript('');
    setErrorMessage(null);
    setState('idle');
  }, [clearAutoStop]);

  const stop = useCallback(() => {
    clearAutoStop();
    if (SPEECH_SUPPORTED) nativeStop();
    else webRec.current?.stop();
  }, [clearAutoStop]);

  const start = useCallback(
    (contextual?: string[]) => {
      clearAutoStop();
      setErrorMessage(null);
      nativeCommittedRef.current = '';
      nativeLastPreviewRef.current = '';
      setLiveTranscript('');
      setResult(null);

      if (SPEECH_SUPPORTED) {
        nativeAbort();
        setState('requesting');
        nativeStart(contextual);
        armSpeechAutoStop(autoTimerRef, clearAutoStop, nativeStop);
        return;
      }
      if (Platform.OS === 'web' && webSpeechAvailable()) {
        webRec.current?.abort();
        setState('requesting');
        const h = startWebContinuousSession(
          () => {
            setState('listening');
            setErrorMessage(null);
          },
          (preview) => setLiveTranscript(preview),
          (text, confidence) => {
            setResult({ transcript: text, confidence });
            setLiveTranscript('');
            setState('processing');
          },
          (msg) => {
            clearAutoStop();
            setErrorMessage(msg);
            setState('error');
          },
          () => {
            clearAutoStop();
            setState((s) => (s === 'error' ? s : 'idle'));
          }
        );
        webRec.current = h;
        if (!h) setState('error');
        else armSpeechAutoStop(autoTimerRef, clearAutoStop, () => webRec.current?.stop());
      }
    },
    [clearAutoStop]
  );

  return {
    state,
    result,
    liveTranscript,
    errorMessage,
    reset,
    supported: SPEECH_CLIENT_SUPPORTED,
    start,
    stop,
  };
}
