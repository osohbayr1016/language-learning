import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AuthLocaleStrings } from '../../i18n/authLocales';
import { colors, spacing, typography } from '../../theme';

export function AuthForgotLink({ strings }: { strings: AuthLocaleStrings }) {
  return (
    <View style={styles.forgotRow}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (Platform.OS === 'web') {
            const g = globalThis as typeof globalThis & { alert?: (msg: string) => void };
            g.alert?.(strings.forgotPasswordMsg);
          } else {
            Alert.alert(strings.forgotPassword, strings.forgotPasswordMsg);
          }
        }}
      >
        <Text style={styles.forgot}>{strings.forgotPassword}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  forgotRow: { alignItems: 'flex-end', marginBottom: spacing.sm },
  forgot: { ...typography.body.sm, color: colors.brand.secondary, fontWeight: '700' },
});
