import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { useAuthLocale } from './AuthLocaleContext';

type Props = { mode: 'login' | 'register' };

export function AuthFooter({ mode }: Props) {
  const { strings } = useAuthLocale();

  if (mode === 'login') {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{strings.noAccount} </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel={strings.signUp}>
            <Text style={styles.link}>{strings.signUp}</Text>
          </Pressable>
        </Link>
      </View>
    );
  }
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{strings.hasAccount} </Text>
      <Link href="/(auth)/login" asChild>
        <Pressable accessibilityRole="button" accessibilityLabel={strings.signIn}>
          <Text style={styles.link}>{strings.signIn}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  text: { ...typography.body.md, color: colors.text.secondary },
  link: { ...typography.body.md, color: colors.brand.primary, fontWeight: '700' },
});
