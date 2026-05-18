import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export function GameLessonTooFew({ message }: { message: string }) {
  return (
    <Screen>
      <View style={styles.box}>
        <Text style={styles.title}>{mn.games.lessonWordsShort}</Text>
        <Text style={styles.body}>{message}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, justifyContent: 'center', padding: spacing.lg },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.sm },
  body: { ...typography.body.md, color: colors.text.secondary, lineHeight: 22 },
});
