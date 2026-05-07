import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { getItem, removeItem, setItem } from '../lib/storage';
import type { ChineseLevel, LearningReason } from '../features/setup/types';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const ONBOARDING_KEY = 'has_seen_onboarding';
const LEVEL_KEY = 'chinese_level';
const REASON_KEY = 'learning_reason';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  chineseLevel: ChineseLevel | null;
  reason: LearningReason | null;
}

interface AuthContextType extends AuthState {
  signIn: (tokens: { access_token: string; refresh_token: string }) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  saveSetup: (level: ChineseLevel, reason: LearningReason) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    isLoading: true,
    isAuthenticated: false,
    hasSeenOnboarding: false,
    chineseLevel: null,
    reason: null,
  });

  useEffect(() => {
    void bootstrap();
    async function bootstrap() {
      let token: string | null = null;
      let hasSeenOnboarding = false;
      let chineseLevel: ChineseLevel | null = null;
      let reason: LearningReason | null = null;
      try {
        token = await getItem(TOKEN_KEY);
        const refresh = await getItem(REFRESH_KEY);
        const flag = await getItem(ONBOARDING_KEY);
        hasSeenOnboarding = flag === 'true';
        chineseLevel = (await getItem(LEVEL_KEY)) as ChineseLevel | null;
        reason = (await getItem(REASON_KEY)) as LearningReason | null;

        if (!token && refresh) {
          try {
            const res = await api.auth.refresh(refresh);
            token = res.data.access_token;
            await setItem(TOKEN_KEY, token);
          } catch {
            await removeItem(TOKEN_KEY);
            await removeItem(REFRESH_KEY);
            token = null;
          }
        }
      } catch (e) {
        console.error('Auth bootstrap failed', e);
      }
      setState({
        token,
        isLoading: false,
        isAuthenticated: !!token,
        hasSeenOnboarding,
        chineseLevel,
        reason,
      });
    }
  }, []);

  const signIn = async (tokens: { access_token: string; refresh_token: string }) => {
    await setItem(TOKEN_KEY, tokens.access_token);
    await setItem(REFRESH_KEY, tokens.refresh_token);
    setState((s) => ({ ...s, token: tokens.access_token, isAuthenticated: true }));
  };

  const signOut = async () => {
    const refresh = await getItem(REFRESH_KEY);
    if (refresh) {
      try { await api.auth.logout(refresh); } catch { /* ignore */ }
    }
    await removeItem(TOKEN_KEY);
    await removeItem(REFRESH_KEY);
    setState((s) => ({ ...s, token: null, isAuthenticated: false }));
  };

  const completeOnboarding = async () => {
    await setItem(ONBOARDING_KEY, 'true');
    setState((s) => ({ ...s, hasSeenOnboarding: true }));
  };

  const saveSetup = async (level: ChineseLevel, reason: LearningReason) => {
    await setItem(LEVEL_KEY, level);
    await setItem(REASON_KEY, reason);
    setState((s) => ({ ...s, chineseLevel: level, reason }));
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, completeOnboarding, saveSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
