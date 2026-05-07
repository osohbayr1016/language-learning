import { useCallback, useRef } from 'react';

export function useAdaptiveTimer() {
  const startRef = useRef<number | null>(null);

  const start = useCallback(() => {
    startRef.current = Date.now();
  }, []);

  const elapsed = useCallback((): number | undefined => {
    if (startRef.current == null) return undefined;
    return Date.now() - startRef.current;
  }, []);

  const stopAndReset = useCallback((): number | undefined => {
    const ms = elapsed();
    startRef.current = null;
    return ms;
  }, [elapsed]);

  return { start, elapsed, stopAndReset };
}
