import { useEffect } from 'react';

/** word.id өөрчлөгдөх бүрт ярианы session зогсоох + UI төлөв шинэчлэх */
export function useSpeakWordSessionReset(
  wordId: number,
  stop: () => void,
  reset: () => void,
  onResetUi: () => void
): void {
  useEffect(() => {
    void stop();
    reset();
    onResetUi();
  }, [wordId, stop, reset, onResetUi]);
}
