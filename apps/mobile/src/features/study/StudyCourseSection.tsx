import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LessonPath } from '../lessons/LessonPath';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

/** Сурах таб дээрх хичээлийн замын гарчиг + жагсаалт */
export function StudyCourseSection() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{mn.study.coursePathTitle}</Text>
      <Text style={styles.sub}>{mn.study.coursePathSubtitle}</Text>
      <LessonPath />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: 4 },
  sub: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.md },
});
