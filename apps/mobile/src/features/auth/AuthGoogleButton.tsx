import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text } from 'react-native';
import type { AuthLocaleStrings } from '../../i18n/authLocales';
import { colors, spacing, typography } from '../../theme';

export function AuthGoogleButton({ strings }: { strings: AuthLocaleStrings }) {
  return (
    <Pressable
      accessibilityRole="button"
      style={styles.googleBtn}
      onPress={() => {
        if (Platform.OS === 'web') {
          const g = globalThis as typeof globalThis & { alert?: (msg: string) => void };
          g.alert?.(strings.googleSoon);
        } else {
          Alert.alert(strings.signInWithGoogle, strings.googleSoon);
        }
      }}
    >
      <Text style={styles.googleText}>{strings.signInWithGoogle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  googleBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.bg.secondary,
  },
  googleText: { ...typography.body.md, color: colors.text.primary, fontWeight: '600' },
});
