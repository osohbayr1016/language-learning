import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { mn } from '../../i18n/mn';
import { colors } from '../../theme';
import { mockExamStyles as styles } from './mockExamStyles';
import { MockExamTemplatePicker } from './MockExamTemplatePicker';
import { MockExamRunView } from './MockExamRunView';
import { useMockExamSession } from './useMockExamSession';

export function MockExamScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const hook = useMockExamSession(token);

  const { sid, qs, idx, setIdx, ans, result, loadingList, starting, startFailed, selectable, begin, pick } =
    hook;
  const cur = qs[idx];
  const totalQ = qs.length;

  const submitAll = () => void hook.submitAll();
  const exit = () => router.back();

  if (!token) {
    return (
      <Screen edges={['top']}>
        <Text style={styles.muted}>{mn.auth.loginTitle}</Text>
      </Screen>
    );
  }

  if (loadingList) {
    return (
      <Screen edges={['top']}>
        <ActivityIndicator color={colors.brand.primary} />
      </Screen>
    );
  }

  if (sid === null) {
    if (selectable.length === 0 || startFailed) {
      return (
        <Screen edges={['top']}>
          <Text style={styles.muted}>{mn.study.courseEmpty}</Text>
        </Screen>
      );
    }
    if (selectable.length > 1) {
      return (
        <Screen edges={['top']} scroll>
          {starting ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={mn.common.back}
                style={styles.pickerBack}
                onPress={exit}
                hitSlop={12}
              >
                <Text style={styles.pickerBackTx}>{mn.common.back}</Text>
              </Pressable>
              <ActivityIndicator color={colors.brand.primary} />
            </>
          ) : (
            <MockExamTemplatePicker templates={selectable} onPick={(id) => void begin(id)} onBack={exit} />
          )}
        </Screen>
      );
    }
    return (
      <Screen edges={['top']}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={mn.common.back}
          style={styles.pickerBack}
          onPress={exit}
          hitSlop={12}
        >
          <Text style={styles.pickerBackTx}>{mn.common.back}</Text>
        </Pressable>
        <ActivityIndicator color={colors.brand.primary} />
      </Screen>
    );
  }

  if (result) {
    return (
      <Screen edges={['top']} scroll>
        <Text style={styles.h1}>{mn.common.done}</Text>
        <Text style={styles.p}>
          Оноо: {result.total} / 200 (тэнцэх: {result.line})
        </Text>
        <Text style={styles.p}>{result.passed ? 'Тэнцсэн!' : 'Дахин оролдоорой'}</Text>
        <Pressable style={styles.doneExit} onPress={exit}>
          <Text style={styles.doneExitTx}>{mn.study.mockExamDoneExit}</Text>
        </Pressable>
      </Screen>
    );
  }

  if (!cur || totalQ === 0) {
    return (
      <Screen edges={['top']}>
        <Text style={styles.muted}>{mn.study.courseEmpty}</Text>
      </Screen>
    );
  }

  return (
    <MockExamRunView
      cur={cur}
      idx={idx}
      totalQ={totalQ}
      ansForCur={ans[cur.id] ?? ''}
      onPick={pick}
      onPrev={() => setIdx((i) => Math.max(i - 1, 0))}
      onNext={() => setIdx((i) => Math.min(i + 1, totalQ - 1))}
      onSubmit={submitAll}
      onExit={exit}
    />
  );
}
