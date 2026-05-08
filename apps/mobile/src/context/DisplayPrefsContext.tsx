import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getItem, setItem } from '../lib/storage';

const KEY = 'show_pinyin_study';

type Ctx = {
  showPinyin: boolean;
  setShowPinyin: (v: boolean) => Promise<void>;
  toggleShowPinyin: () => Promise<void>;
};

const C = createContext<Ctx | undefined>(undefined);

export function DisplayPrefsProvider({ children }: { children: React.ReactNode }) {
  const [showPinyin, setState] = useState(true);

  useEffect(() => {
    void (async () => {
      const raw = await getItem(KEY);
      if (raw === '0') setState(false);
      else if (raw === '1') setState(true);
    })();
  }, []);

  const setShowPinyin = useCallback(async (v: boolean) => {
    setState(v);
    await setItem(KEY, v ? '1' : '0');
  }, []);

  const toggleShowPinyin = useCallback(async () => {
    await setShowPinyin(!showPinyin);
  }, [showPinyin, setShowPinyin]);

  return (
    <C.Provider value={{ showPinyin, setShowPinyin, toggleShowPinyin }}>{children}</C.Provider>
  );
}

export function useDisplayPrefs() {
  const x = useContext(C);
  if (!x) throw new Error('useDisplayPrefs must be within DisplayPrefsProvider');
  return x;
}
