import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';
import { ONBOARDING_LOCALE_CODES } from './onboardingCopy';
import { useOnboardingLocale, useOnboardingStrings } from './OnboardingLocaleContext';

const webFocus =
  Platform.OS === 'web'
    ? ({
        outlineStyle: 'solid' as const,
        outlineWidth: 2,
        outlineColor: colors.brand.secondary,
        outlineOffset: 2,
      } as const)
    : null;

type Props = { step: number; total: number };

export function OnboardingTopBar({ step, total }: Props) {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const { locale, setLocale } = useOnboardingLocale();
  const t = useOnboardingStrings(step, total);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.brand} accessibilityRole="header">
          {t.appName}
        </Text>
        <View style={styles.langRow}>
          {ONBOARDING_LOCALE_CODES.map((code) => {
            const active = locale === code;
            const label = code === 'mn' ? 'MN' : code === 'en' ? 'EN' : '中文';
            return (
              <Pressable
                key={code}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: active }}
                onPress={() => setLocale(code)}
                style={({ focused }) => [
                  styles.langBtn,
                  active && styles.langBtnOn,
                  focused && webFocus,
                ]}
              >
                <Text style={[styles.langText, active && styles.langTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Text style={styles.progress} accessibilityLiveRegion="polite">
        {t.stepOf}
      </Text>
      <View style={styles.authRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.login}
          onPress={async () => {
            await completeOnboarding();
            router.push('/(auth)/login');
          }}
          style={({ focused }) => [styles.linkBtn, focused && webFocus]}
        >
          <Text style={styles.link}>{t.login}</Text>
        </Pressable>
        <Text style={styles.dot}> · </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t.signUp}
          onPress={async () => {
            await completeOnboarding();
            router.push('/(auth)/register');
          }}
          style={({ focused }) => [styles.linkBtn, focused && webFocus]}
        >
          <Text style={styles.link}>{t.signUp}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { ...typography.heading.md, color: colors.text.primary },
  langRow: { flexDirection: 'row', gap: spacing.xs },
  langBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langBtnOn: { backgroundColor: colors.bg.secondary, borderColor: colors.brand.primary },
  langText: { ...typography.body.sm, color: colors.text.secondary, fontWeight: '600' },
  langTextOn: { color: colors.text.primary },
  progress: {
    ...typography.body.sm,
    color: colors.text.muted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  authRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  linkBtn: { paddingVertical: 4, paddingHorizontal: 4 },
  link: {
    ...typography.body.sm,
    color: colors.brand.secondary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  dot: { ...typography.body.sm, color: colors.text.muted },
});
