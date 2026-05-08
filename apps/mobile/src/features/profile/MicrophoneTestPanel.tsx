import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ensureSpeechPermission, useSpeechSession } from '../../lib/audio/speech';
import { mn } from '../../i18n/mn';
import { colors, radius, spacing, typography } from '../../theme';

export function MicrophoneTestPanel() {
  const { state, result, liveTranscript, errorMessage, reset, supported, start, stop } =
    useSpeechSession();
  const activeMic = state === 'listening' || state === 'requesting';
  const [outcome, setOutcome] = useState<'success' | 'fail' | null>(null);
  const [detail, setDetail] = useState('');
  const sessionActiveRef = useRef(false);
  const resultRef = useRef<string | null>(null);

  useEffect(() => {
    resultRef.current = result?.transcript?.trim() ? result.transcript : null;
  }, [result]);

  useEffect(() => {
    const t = result?.transcript?.trim();
    if (!t) return;
    sessionActiveRef.current = false;
    setOutcome('success');
    setDetail(t);
  }, [result]);

  useEffect(() => {
    if (!errorMessage) return;
    sessionActiveRef.current = false;
    setOutcome('fail');
    setDetail(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (state !== 'idle') return;
    if (!sessionActiveRef.current) return;
    const tm = setTimeout(() => {
      if (!sessionActiveRef.current) return;
      if (resultRef.current) return;
      sessionActiveRef.current = false;
      setOutcome('fail');
      setDetail(mn.profile.micTestNoSpeech);
    }, 150);
    return () => clearTimeout(tm);
  }, [state]);

  const onPress = useCallback(async () => {
    if (activeMic) {
      stop();
      return;
    }
    const ok = await ensureSpeechPermission();
    if (!ok) {
      sessionActiveRef.current = false;
      setOutcome('fail');
      setDetail(mn.profile.micTestPermissionDenied);
      return;
    }
    sessionActiveRef.current = true;
    setOutcome(null);
    setDetail('');
    reset();
    start([]);
  }, [activeMic, reset, start, stop]);

  if (!supported) {
    return (
      <Text style={styles.muted}>{mn.profile.micTestUnsupported}</Text>
    );
  }

  return (
    <View>
      <Text style={styles.hint}>{mn.profile.micTestHint}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => void onPress()}
        style={({ pressed }) => [
          styles.btn,
          activeMic ? styles.btnStop : styles.btnGo,
          pressed && styles.pressed,
          Platform.OS === 'web' && styles.btnWeb,
        ]}
      >
        <View style={styles.btnInner}>
          <Ionicons name={activeMic ? 'stop' : 'mic'} size={22} color="#fff" />
          <Text style={styles.btnLabel}>
            {activeMic ? mn.profile.micTestStop : mn.profile.micTestStart}
          </Text>
        </View>
      </Pressable>
      {activeMic && liveTranscript ? (
        <Text style={styles.live}>
          {mn.profile.micTestHeard} «{liveTranscript}»
        </Text>
      ) : null}
      {outcome === 'success' ? (
        <View style={styles.rowOk}>
          <Ionicons name="checkmark-circle" size={22} color={colors.success} />
          <Text style={styles.okText}>
            {mn.profile.micTestOk}: «{detail}»
          </Text>
        </View>
      ) : null}
      {outcome === 'fail' ? (
        <View style={styles.rowBad}>
          <Ionicons name="close-circle" size={22} color={colors.error} />
          <Text style={styles.badText}>{mn.profile.micTestFail}: {detail}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hint: { ...typography.body.sm, color: colors.text.secondary, marginBottom: spacing.md },
  muted: { ...typography.body.sm, color: colors.text.muted },
  btn: {
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 3,
  },
  btnGo: { backgroundColor: colors.brand.primary, borderBottomColor: colors.brand.primaryShadow },
  btnStop: { backgroundColor: colors.error, borderBottomColor: 'rgba(0,0,0,0.2)' },
  btnWeb: { cursor: 'pointer' as const },
  pressed: { opacity: 0.92 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  btnLabel: { ...typography.body.md, color: '#fff', fontWeight: '700' },
  live: { ...typography.body.sm, color: colors.text.primary, marginTop: spacing.sm },
  rowOk: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.md },
  okText: { ...typography.body.sm, color: colors.success, flex: 1 },
  rowBad: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.md },
  badText: { ...typography.body.sm, color: colors.error, flex: 1 },
});
