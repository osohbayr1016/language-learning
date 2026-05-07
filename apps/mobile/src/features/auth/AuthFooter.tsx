import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = { mode: 'login' | 'register' };

export function AuthFooter({ mode }: Props) {
  if (mode === 'login') {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{mn.auth.noAccount} </Text>
        <Link href="/(setup)" asChild>
          <Pressable>
            <Text style={styles.link}>{mn.auth.signUp}</Text>
          </Pressable>
        </Link>
      </View>
    );
  }
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{mn.auth.hasAccount} </Text>
      <Link href="/(auth)/login" asChild>
        <Pressable>
          <Text style={styles.link}>{mn.auth.signIn}</Text>
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
