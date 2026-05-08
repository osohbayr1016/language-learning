import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Hsk1ProgramSection } from './Hsk1ProgramSection';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

/** Сурах таб дээрх HSK 1 бүрэн хөтөлбөр + хичээлийн жагсаалт */
export function StudyCourseSection() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{mn.study.hsk1StudySectionTitle}</Text>
      <Hsk1ProgramSection />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  title: { ...typography.heading.md, color: colors.text.primary, marginBottom: spacing.md },
});
