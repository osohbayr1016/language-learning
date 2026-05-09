import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { safeBack } from '../../../lib/navigation/safeBack';
import { Button, Screen } from '../../../primitives';
import { MandarinSpeechCard } from '../../../components/practice/MandarinSpeechCard';
import { useRandomWords } from '../../../hooks/useRandomWords';
import { StudyHeader } from '../StudyHeader';
import { mn } from '../../../i18n/mn';
import { colors, spacing } from '../../../theme';

export default function SpeakPracticeScreen() {
  const router = useRouter();
  const { words, loading, error } = useRandomWords(40);
  const pool = useMemo(
    () => words.filter((w) => (w.example_zh ?? w.hanzi ?? '').length > 0),
    [words]
  );
  const [idx, setIdx] = useState(0);
  const [roundDone, setRoundDone] = useState(false);
  const [sessionSum, setSessionSum] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const current = pool[idx] ?? null;
  const sessionAvg = sessionCount > 0 ? Math.round(sessionSum / sessionCount) : null;

  const next = () => {
    if (idx + 1 >= pool.length) {
      setIdx(0);
    } else {
      setIdx((i) => i + 1);
    }
    setRoundDone(false);
  };

  if (loading) {
    return (
      <Screen scroll>
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      </Screen>
    );
  }

  if (error || !current) {
    return (
      <Screen scroll>
        <StudyHeader title={mn.study.speak} index={0} total={1} />
        <Text style={styles.err}>{error ?? mn.study.wordsLoadError}</Text>
        <Button label={mn.common.back} onPress={() => safeBack(router, '/(tabs)/study')} />
      </Screen>
    );
  }

  return (
    <Screen scroll scrollBottomInset={24}>
      <StudyHeader title={mn.study.speak} index={idx} total={pool.length} />
      <Text style={styles.sub}>{mn.study.speakDesc}</Text>
      {sessionAvg !== null ? (
        <Text style={styles.sessionAvg}>
          {mn.study.speakSessionAvg
            .replace('{count}', String(sessionCount))
            .replace('{avg}', String(sessionAvg))}
        </Text>
      ) : null}
      <MandarinSpeechCard
        key={`speak-${idx}-${current.id}`}
        word={current}
        onEvaluated={() => setRoundDone(true)}
        onScore={(n) => {
          setSessionSum((s) => s + n);
          setSessionCount((c) => c + 1);
        }}
      />
      {roundDone ? (
        <View style={styles.footer}>
          <Button label={mn.common.next} onPress={next} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, minHeight: 200, alignItems: 'center', justifyContent: 'center' },
  sub: {
    color: colors.text.secondary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  sessionAvg: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  err: { color: colors.error, marginVertical: spacing.md },
  footer: { marginTop: spacing.lg },
});
