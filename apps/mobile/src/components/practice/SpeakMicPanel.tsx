import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

type Props = {
  disabled: boolean;
  submitted: boolean;
  processing: boolean;
  activeMic: boolean;
  onMicPress: () => void;
  liveTranscript: string;
  outcome: string;
  errorMessage: string | null;
  /** Override default MN helper while mic is live. */
  listeningHint?: string;
  liveTranscriptLabel?: string;
};

export function SpeakMicPanel({
  disabled,
  submitted,
  processing,
  activeMic,
  onMicPress,
  liveTranscript,
  outcome,
  errorMessage,
  listeningHint,
  liveTranscriptLabel,
}: Props) {
  const hintWhileListening =
    listeningHint ?? mn.study.speakListeningHint;
  const liveLbl = liveTranscriptLabel ?? mn.study.speakLiveLabel;
  return (
    <View style={styles.micWrap}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled || submitted || processing}
        onPress={onMicPress}
        style={({ pressed }) => [
          styles.mic,
          { backgroundColor: activeMic ? colors.error : colors.brand.primary },
          pressed && styles.pressed,
          Platform.OS === 'web' && styles.micWeb,
        ]}
      >
        <View pointerEvents="none" accessible={false}>
          <Ionicons name={activeMic ? 'stop' : 'mic'} size={36} color="#FFFFFF" />
        </View>
      </Pressable>
      <Text style={styles.helper}>
        {activeMic
          ? `${hintWhileListening}${liveTranscript ? `\n${liveLbl} «${liveTranscript}»` : ''}`
          : outcome}
      </Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  micWrap: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  mic: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  micWeb: { cursor: 'pointer' as const },
  pressed: { transform: [{ scale: 0.97 }] },
  helper: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  error: { ...typography.body.sm, color: colors.error, textAlign: 'center' },
});
