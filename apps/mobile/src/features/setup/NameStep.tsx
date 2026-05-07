import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function NameStep({ value, onChange }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{mn.setup.nameTitle}</Text>
      <Input
        label={mn.setup.nameLabel}
        value={value}
        onChangeText={onChange}
        placeholder={mn.setup.namePlaceholder}
        autoCapitalize="words"
        autoCorrect={false}
        autoFocus
        containerStyle={{ marginTop: spacing.lg }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing.md },
  title: { ...typography.heading.xl, color: colors.text.primary, lineHeight: 36 },
});
