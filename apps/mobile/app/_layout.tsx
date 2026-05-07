import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isAuthenticated, isLoading, hasSeenOnboarding, hasCompletedSetup } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inSetupGroup = segments[0] === '(setup)';

    if (isAuthenticated) {
      if (!hasCompletedSetup && !inSetupGroup) {
        // Newly registered users must complete setup
        router.replace('/(setup)/profile');
      } else if (hasCompletedSetup && (inAuthGroup || inOnboarding || inSetupGroup)) {
        // Authenticated users who completed setup go to tabs
        router.replace('/(tabs)');
      }
    } else {
      // If not authenticated
      if (!hasSeenOnboarding) {
        // First time users go to onboarding
        if (!inOnboarding) {
          console.log('[InitialLayout] Redirecting to /onboarding');
          router.replace('/onboarding');
        }
      } else {
        // Returning unauthenticated users go to login
        if (!inAuthGroup && !inOnboarding) {
          console.log('[InitialLayout] Redirecting to /(auth)/login');
          router.replace('/(auth)/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, hasSeenOnboarding, hasCompletedSetup, segments]);

  console.log('[InitialLayout] Rendering, segments:', segments);
  return <Slot />;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const customTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.bg.primary,
      card: colors.bg.secondary,
      text: colors.text.primary,
      border: colors.border,
      primary: colors.accent.purple,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={customTheme}>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
