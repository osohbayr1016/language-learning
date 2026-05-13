import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Exercise } from '../types';
import { colors, radius, spacing, typography } from '../../../theme';

type Ex = Extract<Exercise, { kind: 'imported-workbook' }>;

function isCorrect(answer: Ex['item']['answer'], value: string): boolean {
  if (answer == null || answer === '') return true;
  if (typeof answer === 'boolean') return String(answer) === value;
  return String(answer).trim() === value.trim();
}

export function ImportedWorkbookCard({
  exercise,
  disabled,
  onAnswer,
}: {
  exercise: Ex;
  disabled: boolean;
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const options = exercise.item.options ?? (exercise.sectionType.includes('tf') ? ['true', 'false'] : []);

  return (
    <View style={styles.wrap}>
      <Text style={styles.section}>{exercise.sectionTitle}</Text>
      {exercise.bank?.length ? <Text style={styles.bank}>Үгс: {exercise.bank.join(' / ')}</Text> : null}
      {exercise.item.parts?.length ? <Text style={styles.bank}>{exercise.item.parts.join(' / ')}</Text> : null}
      <Text style={styles.q}>{exercise.item.q}</Text>
      {options.length ? (
        <View style={styles.options}>
          {options.map((o) => (
            <Pressable
              key={o}
              disabled={disabled}
              style={[styles.opt, picked === o && styles.optOn]}
              onPress={() => {
                setPicked(o);
                onAnswer(isCorrect(exercise.item.answer, o));
              }}
            >
              <Text style={styles.optText}>{o}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Pressable disabled={disabled} style={[styles.btn, disabled && styles.disabled]} onPress={() => onAnswer(true)}>
          <Text style={styles.btnText}>Уншсан</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  section: { ...typography.body.sm, color: colors.text.muted, fontWeight: '800' },
  bank: { ...typography.body.sm, color: colors.brand.secondary, lineHeight: 20 },
  q: { ...typography.heading.sm, color: colors.text.primary, lineHeight: 28 },
  options: { gap: spacing.sm },
  opt: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: colors.bg.primary,
  },
  optOn: { borderColor: colors.brand.primary, backgroundColor: `${colors.brand.primary}18` },
  optText: { ...typography.body.md, color: colors.text.primary, fontWeight: '700' },
  btn: { borderRadius: radius.md, backgroundColor: colors.brand.primary, padding: spacing.md, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  btnText: { ...typography.body.md, color: '#fff', fontWeight: '800' },
});
