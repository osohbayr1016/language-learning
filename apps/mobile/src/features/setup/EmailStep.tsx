import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
};

export function EmailStep({ name, value, onChange, error }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>
        {mn.setup.emailTitle.replace('{name}', name || '')}
      </Text>
      <Input
        label={mn.setup.emailLabel}
        value={value}
        onChangeText={onChange}
        placeholder={mn.setup.emailPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        autoFocus
        leftIcon={<Ionicons name="mail-outline" size={22} color={colors.text.muted} />}
        error={error ?? undefined}
        containerStyle={{ marginTop: spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.md },
  title: { ...typography.heading.xl, color: colors.text.primary, lineHeight: 36 },
});
