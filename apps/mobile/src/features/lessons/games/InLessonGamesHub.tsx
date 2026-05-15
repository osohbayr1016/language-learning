import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';

type Props = {
  onContinue: () => void;
  onDone: () => void;
};

export function InLessonGamesHub({ onContinue, onDone }: Props) {
  return (
    <Screen edges={['top', 'bottom']} scroll>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Хичээлээ шалгах</Text>
          <Text style={styles.desc}>
            Та энэ хичээлээр сурсан зүйлээ тоглоом тоглож баталгаажуулах боломжтой.
          </Text>
        </View>

        <View style={styles.btns}>
          <Button
            label="Үргэлжлүүлэх"
            variant="primary"
            onPress={onContinue}
            accessibilityLabel="Үргэлжлүүлэх"
          />
          <Button
            label="Дуусгах"
            variant="secondary"
            onPress={onDone}
            accessibilityLabel="Дуусгах"
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    gap: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.heading.xl,
    color: colors.text.primary,
    textAlign: 'center',
  },
  desc: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  btns: {
    gap: spacing.md,
  },
});
