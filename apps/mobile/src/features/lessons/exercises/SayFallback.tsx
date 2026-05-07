import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../primitives';
import { colors, radius, spacing, typography } from '../../../theme';

type Props = {
  disabled: boolean;
  onSpoken: () => void;
  onSkip: () => void;
};

export function SayFallback({ disabled, onSpoken, onSkip }: Props) {
  return (
    <View style={styles.root}>
      <View style={styles.notice}>
        <Ionicons name="information-circle" size={22} color={colors.warning} />
        <Text style={styles.text}>
          Микрофоны функц зөвхөн dev build дээр ажилладаг. Та өгүүлбэрийг чанга
          уншаад "Хэллээ" дээр дарна уу.
        </Text>
      </View>
      <Button label="ХЭЛЛЭЭ" onPress={onSpoken} disabled={disabled} />
      <View style={{ height: spacing.sm }} />
      <Button label="АЛГАСАХ" variant="secondary" onPress={onSkip} disabled={disabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginTop: spacing.lg },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: '#FFF6D8',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  text: { flex: 1, ...typography.body.md, color: colors.text.primary },
});
