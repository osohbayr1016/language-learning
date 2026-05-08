import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { AudioProvider } from "../src/context/AudioContext";
import { GamificationProvider } from "../src/context/GamificationContext";
import { AppShell } from "../src/primitives/AppShell";
import { colors } from "../src/theme";

SplashScreen.preventAutoHideAsync();

function RouteGuard() {
  const { isAuthenticated, isLoading, hasSeenOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuth = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "(onboarding)";
    const inSetup = segments[0] === "(setup)";
    const inTabs = segments[0] === "(tabs)";
    const rootSegment = segments[0] as string | undefined;
    const inAdmin = rootSegment === "admin";

    if (inAdmin) {
      if (!isAuthenticated) {
        router.replace("/(auth)/login");
        return;
      }
      return;
    }

    if (isAuthenticated) {
      if (!inTabs && (inAuth || inOnboarding || inSetup)) {
        router.replace("/(tabs)/home");
      }
    } else {
      if (!hasSeenOnboarding && !inOnboarding) {
        router.replace("/(onboarding)");
      } else if (hasSeenOnboarding && !inAuth && !inOnboarding && !inSetup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, isLoading, hasSeenOnboarding, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colors.bg.primary,
      card: colors.bg.primary,
      text: colors.text.primary,
      border: colors.border,
      primary: colors.brand.primary,
    },
  };

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.bg.primary }}
    >
      <ThemeProvider value={navTheme}>
        <AuthProvider>
          <AudioProvider>
            <GamificationProvider>
              <StatusBar style="dark" />
              <AppShell>
                <RouteGuard />
              </AppShell>
            </GamificationProvider>
          </AudioProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
