import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { Pill } from '../../primitives';
import { mn } from '../../i18n/mn';
import { useGamification } from '../../context/GamificationContext';
import { DueWordsList } from './DueWordsList';

type Props = { limit?: number };

export function DueWordsSection({ limit = 5 }: Props) {
  const { dueToday } = useGamification();
  return (
    <View style={styles.section}>
      <View style={styles.head}>
        <Text style={styles.title}>{mn.study.dueSection}</Text>
        {dueToday > 0 ? (
          <Pill
            label={String(dueToday)}
            color={colors.brand.primary}
            filled
            size="sm"
          />
        ) : null}
      </View>
      <DueWordsList limit={limit} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.sm },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: { ...typography.heading.md, color: colors.text.primary },
});
