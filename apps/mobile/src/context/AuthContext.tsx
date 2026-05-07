import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../lib/api';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';
const ONBOARDING_KEY = 'has_seen_onboarding';
const SETUP_KEY = 'has_completed_setup';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  hasCompletedSetup: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (tokens: { access_token: string; refresh_token: string }) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completeSetup: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    isLoading: true,
    isAuthenticated: false,
    hasSeenOnboarding: false,
    hasCompletedSetup: false,
  });

  useEffect(() => {
    // Check for token on mount
    const bootstrapAsync = async () => {
      let token: string | null = null;
      let refreshToken: string | null = null;
      let hasSeenOnboarding = false;
      let hasCompletedSetup = false;

      try {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
        refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
        
        const onboardingFlag = await SecureStore.getItemAsync(ONBOARDING_KEY);
        hasSeenOnboarding = onboardingFlag === 'true';

        const setupFlag = await SecureStore.getItemAsync(SETUP_KEY);
        hasCompletedSetup = setupFlag === 'true';

        // Optional: Implement refresh token logic here if access token is expired
        // For MVP, we just check if token exists
        
        // If we have a refresh token but no access token, try to refresh
        if (!token && refreshToken) {
           try {
             const res = await api.auth.refresh(refreshToken);
             token = res.data.access_token;
             await SecureStore.setItemAsync(TOKEN_KEY, token);
           } catch (e) {
             console.error("Failed to refresh token on boot", e);
             // Clear invalid tokens
             await SecureStore.deleteItemAsync(TOKEN_KEY);
             await SecureStore.deleteItemAsync(REFRESH_KEY);
           }
        }

      } catch (e) {
        console.error('Failed to restore token', e);
      }

      setState((prev) => ({
        ...prev,
        token: token || null,
        isLoading: false,
        isAuthenticated: !!token,
        hasSeenOnboarding,
        hasCompletedSetup,
      }));
    };

    bootstrapAsync();
  }, []);

  const signIn = async ({ access_token, refresh_token }: { access_token: string; refresh_token: string }) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      await SecureStore.setItemAsync(REFRESH_KEY, refresh_token);
      setState((prev) => ({
        ...prev,
        token: access_token,
        isLoading: false,
        isAuthenticated: true,
      }));
    } catch (e) {
      console.error('Failed to store tokens', e);
    }
  };

  const signOut = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
      if (refreshToken) {
        try {
           await api.auth.logout(refreshToken);
        } catch(e) {
           console.error("Server logout failed, clearing local tokens anyway");
        }
      }
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      setState((prev) => ({
        ...prev,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      }));
    } catch (e) {
      console.error('Failed to delete tokens', e);
    }
  };

  const completeOnboarding = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      setState((prev) => ({ ...prev, hasSeenOnboarding: true }));
    } catch (e) {
      console.error('Failed to save onboarding state', e);
    }
  };

  const completeSetup = async () => {
    try {
      await SecureStore.setItemAsync(SETUP_KEY, 'true');
      setState((prev) => ({ ...prev, hasCompletedSetup: true }));
    } catch (e) {
      console.error('Failed to set setup complete status', e);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, completeOnboarding, completeSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
