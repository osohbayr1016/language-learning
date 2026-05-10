import React, { useCallback, useRef, useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';
import { OnboardingCarousel, type OnboardingCarouselHandle } from './OnboardingCarousel';
import { useOnboardingStrings } from './OnboardingLocaleContext';
import { OnboardingTopBar } from './OnboardingTopBar';
import { Pagination } from './Pagination';
import { slides } from './slides';

const webFocus =
  Platform.OS === 'web'
    ? ({
        outlineStyle: 'solid' as const,
        outlineWidth: 2,
        outlineColor: colors.brand.secondary,
        outlineOffset: 2,
      } as const)
    : null;

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [containerW, setContainerW] = useState(0);
  const carouselRef = useRef<OnboardingCarouselHandle>(null);
  const t = useOnboardingStrings(current + 1, slides.length);

  const handleNext = async () => {
    if (current < slides.length - 1) {
      carouselRef.current?.scrollTo(current + 1);
      return;
    }
    await completeOnboarding();
    router.replace('/(setup)');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const w = Math.round(e.nativeEvent.layout.width);
    if (w && w !== containerW) setContainerW(w);
  };

  const onIndexChange = useCallback((i: number) => {
    setCurrent(i);
  }, []);

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={styles.container} onLayout={onLayout}>
        <OnboardingTopBar step={current + 1} total={slides.length} />
        <OnboardingCarousel
          ref={carouselRef}
          width={containerW}
          slides={slides}
          strings={t}
          onIndexChange={onIndexChange}
        />
        <View style={styles.bottom}>
          <Pagination count={slides.length} current={current} />
          <Button
            label={current === slides.length - 1 ? t.start : t.next}
            onPress={handleNext}
            accessibilityLabel={current === slides.length - 1 ? t.start : t.next}
            style={{ marginBottom: spacing.md }}
          />
          <View style={styles.skipWrap}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t.skip}
              onPress={handleSkip}
              style={({ focused }) => [styles.skipBtn, focused && webFocus]}
            >
              <Text style={styles.skipText}>{t.skip}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  bottom: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    zIndex: 2,
    backgroundColor: colors.bg.primary,
  },
  skipWrap: { alignItems: 'center' },
  skipBtn: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  skipText: {
    ...typography.body.md,
    color: colors.text.muted,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
