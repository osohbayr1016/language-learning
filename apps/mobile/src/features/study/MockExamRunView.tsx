import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import type { ExamQuestion } from '../../lib/api/exams';
import { mn } from '../../i18n/mn';
import { mockExamStyles as styles } from './mockExamStyles';
import { mockExamOptionStrings, mockExamPromptText } from './mockExamPrompt';
import { confirmQuitMockExam } from './mockExamQuitDialog';
import { colors, spacing, typography } from '../../theme';
import { useMockExamWebKeys } from '../../hooks/useMockExamWebKeys';

type Props = {
  cur: ExamQuestion;
  idx: number;
  totalQ: number;
  ansForCur: string;
  onPick: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onExit: () => void;
};

export function MockExamRunView({
  cur,
  idx,
  totalQ,
  ansForCur,
  onPick,
  onPrev,
  onNext,
  onSubmit,
  onExit,
}: Props) {
  const opts = mockExamOptionStrings(cur);

  useMockExamWebKeys({
    examOptions: opts,
    onPick,
    onPrev,
    onNext,
    isLastQuestion: idx >= totalQ - 1,
    onSubmit,
  });

  const requestExit = () => {
    confirmQuitMockExam(onExit);
  };

  return (
    <Screen edges={['top']} scroll scrollBottomInset={120}>
      {Platform.OS === 'web' ? (
        <Text style={webKeysHint}>{mn.study.webKeysMock}</Text>
      ) : null}
      <View style={styles.runHeader}>
        <Text style={styles.runMeta}>
          {idx + 1} / {totalQ}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={mn.study.mockExamExit}
          onPress={requestExit}
          hitSlop={14}
          style={({ pressed }) => [pressed && { opacity: 0.65 }]}
        >
          <Text style={styles.quitLink}>{mn.study.mockExamExit}</Text>
        </Pressable>
      </View>
      <Text style={styles.prompt}>{mockExamPromptText(cur)}</Text>
      <View style={styles.opts}>
        {opts.map((o) => (
          <Pressable
            key={o}
            style={[styles.opt, ansForCur === o && styles.optOn]}
            onPress={() => onPick(o)}
          >
            <Text style={styles.optTx}>{o}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.nav}>
        <Pressable style={styles.navBtn} onPress={onPrev} disabled={idx === 0}>
          <Text style={styles.navTx}>‹</Text>
        </Pressable>
        <Pressable style={styles.navBtn} onPress={onNext} disabled={idx >= totalQ - 1}>
          <Text style={styles.navTx}>›</Text>
        </Pressable>
      </View>
      {idx >= totalQ - 1 ? (
        <Pressable style={styles.submit} onPress={onSubmit}>
          <Text style={styles.submitTx}>{mn.common.confirm}</Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const webKeysHint = {
  ...typography.body.sm,
  color: colors.text.muted,
  marginBottom: spacing.sm,
  paddingHorizontal: spacing.xs,
};
