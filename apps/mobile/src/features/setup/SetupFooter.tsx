import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../primitives';
import { colors, spacing } from '../../theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function SetupFooter({ label, onPress, disabled, loading }: Props) {
  return (
    <View style={styles.wrap}>
      <Button
        label={label}
        onPress={onPress}
        disabled={disabled}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.bg.primary,
  },
});
