import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import { HomeLearnedLexiconSection } from '../home/HomeLearnedLexiconSection';
import { StudyLessonPrepHskSection } from './StudyLessonPrepHskSection';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

export default function StudyHubScreen() {
  return (
    <Screen scroll scrollBottomInset={70}>
      <View style={styles.pageHead}>
        <Text style={styles.pageTitle}>{mn.tabs.study}</Text>
      </View>
      <HomeLearnedLexiconSection />
      <View style={styles.prepBlock}>
        <Text style={styles.sectionHeading}>{mn.study.lessonPrepSection}</Text>
        <StudyLessonPrepHskSection />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageHead: {
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.heading.xl,
    color: colors.text.primary,
  },
  prepBlock: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionHeading: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
});
