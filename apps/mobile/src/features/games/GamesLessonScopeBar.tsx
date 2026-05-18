import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Props = {
  lessonTitle: string | null;
  onChoose: () => void;
  onClear: () => void;
};

export function GamesLessonScopeBar({ lessonTitle, onChoose, onClear }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label} numberOfLines={2}>
        {lessonTitle ? `${mn.games.lessonScopeLabel}: ${lessonTitle}` : mn.games.lessonScopeAll}
      </Text>
      <View style={styles.actions}>
        <Pressable style={styles.btnPrimary} onPress={onChoose}>
          <Text style={styles.btnPrimaryTxt}>{mn.games.pickLesson}</Text>
        </Pressable>
        {lessonTitle ? (
          <Pressable style={styles.btnGhost} onPress={onClear}>
            <Text style={styles.btnGhostTxt}>{mn.games.clearLesson}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
    gap: spacing.sm,
  },
  label: { ...typography.body.sm, color: colors.text.secondary },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  btnPrimary: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.brand.primary,
  },
  btnPrimaryTxt: { color: '#fff', fontWeight: '800', fontSize: 13 },
  btnGhost: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnGhostTxt: { color: colors.text.primary, fontWeight: '700', fontSize: 13 },
});
