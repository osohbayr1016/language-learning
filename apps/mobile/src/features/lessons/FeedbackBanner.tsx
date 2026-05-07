import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../primitives';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  visible: boolean;
  correct: boolean;
  message?: string;
  correctAnswer?: string;
  onContinue: () => void;
};

export function FeedbackBanner({ visible, correct, message, correctAnswer, onContinue }: Props) {
  if (!visible) return null;

  const bg = correct ? '#D7FFB8' : '#FFDFE0';
  const accent = correct ? colors.success : colors.error;
  const headline = correct ? 'Зөв байна!' : 'Алдаа гарлаа';

  return (
    <View style={[styles.bar, { backgroundColor: bg, borderTopColor: accent }]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: '#FFFFFF' }]}>
          <Ionicons
            name={correct ? 'checkmark-circle' : 'close-circle'}
            size={28}
            color={accent}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: accent }]}>{headline}</Text>
          {!correct && correctAnswer ? (
            <Text style={styles.detail} numberOfLines={2}>
              Зөв хариулт: {correctAnswer}
            </Text>
          ) : null}
          {message ? (
            <Text style={styles.detail} numberOfLines={2}>
              {message}
            </Text>
          ) : null}
        </View>
      </View>
      <Button
        label="ОЙЛГОЛОО"
        onPress={onContinue}
        variant={correct ? 'primary' : 'danger'}
        style={{ marginTop: spacing.sm }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 4,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.heading.md, fontWeight: '800' },
  detail: { ...typography.body.md, color: colors.text.primary, marginTop: 2 },
});
