import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { GrammarExercise } from '../../lib/api/grammar';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

type Props = {
  ex: GrammarExercise;
  value: string;
  onChange: (v: string) => void;
};

function optStrings(ex: GrammarExercise): string[] {
  const o = ex.options;
  return Array.isArray(o) ? o.map((x) => String(x)) : [];
}

export function GrammarExerciseBlock({ ex, value, onChange }: Props) {
  if (ex.exercise_type === 'fill_blank' || ex.exercise_type === 'translate') {
    return (
      <TextInput
        style={styles.inp}
        value={value}
        onChangeText={onChange}
        placeholder={mn.study.typeAnswer}
      />
    );
  }
  if (ex.exercise_type === 'true_false') {
    return (
      <View style={styles.rowBtns}>
        {['true', 'false'].map((v) => (
          <Pressable
            key={v}
            style={[styles.opt, value === v && styles.optOn]}
            onPress={() => onChange(v)}
          >
            <Text style={styles.optTx}>{v === 'true' ? mn.common.confirm : 'Үгүй'}</Text>
          </Pressable>
        ))}
      </View>
    );
  }
  if (ex.exercise_type === 'reorder') {
    return (
      <TextInput
        style={styles.inp}
        value={value}
        onChangeText={onChange}
        placeholder="Ханзаар бүтэн өгүүлбэр"
      />
    );
  }
  return (
    <View style={styles.opts}>
      {optStrings(ex).map((opt) => (
        <Pressable
          key={opt}
          style={[styles.opt, value === opt && styles.optOn]}
          onPress={() => onChange(opt)}
        >
          <Text style={styles.optTx}>{opt}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  inp: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body.md,
  },
  opts: { gap: spacing.xs },
  opt: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg.card,
  },
  optOn: { borderColor: colors.brand.primary, backgroundColor: colors.bg.secondary },
  optTx: { ...typography.body.md, color: colors.text.primary },
  rowBtns: { flexDirection: 'row', gap: spacing.sm },
});
