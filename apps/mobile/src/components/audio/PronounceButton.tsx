import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useAudio } from '../../context/AudioContext';
import { colors, radius, spacing, typography } from '../../theme';
import { gestureToAction, type GestureKind } from '../../lib/audio/engine';

type Props = {
  wordId: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: ViewStyle;
  showHints?: boolean;
};

export function PronounceButton({
  wordId,
  size = 'md',
  color = colors.accent.purple,
  style,
  showHints = false,
}: Props) {
  const { playWord } = useAudio();
  const [active, setActive] = useState<'idle' | 'tap' | 'hold' | 'doubleTap'>('idle');

  const handle = async (kind: GestureKind) => {
    setActive(kind);
    const a = gestureToAction(kind);
    if (a.kind === 'doubleTap') {
      await playWord(wordId, { speed: a.speed, repeat: a.repeat });
    } else {
      await playWord(wordId, { speed: a.speed });
    }
    setActive('idle');
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(280)
    .onEnd(() => { void handle('doubleTap'); })
    .runOnJS(true);

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => { void handle('tap'); })
    .runOnJS(true);

  const longPress = Gesture.LongPress()
    .minDuration(380)
    .onStart(() => { void handle('hold'); })
    .runOnJS(true);

  const composed = Gesture.Exclusive(doubleTap, longPress, singleTap);

  const dim: Record<string, number> = { sm: 36, md: 48, lg: 64 };
  const iconSize: Record<string, number> = { sm: 18, md: 22, lg: 30 };

  return (
    <View style={style}>
      <GestureDetector gesture={composed}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Дуудлага сонсох"
          style={[
            styles.btn,
            { width: dim[size], height: dim[size], backgroundColor: color },
            active === 'hold' && styles.holdGlow,
          ]}
        >
          <Ionicons
            name={active === 'hold' ? 'play' : 'volume-high'}
            size={iconSize[size]}
            color={colors.text.primary}
          />
          {active === 'hold' ? <Text style={styles.badge}>удаан</Text> : null}
        </Pressable>
      </GestureDetector>
      {showHints ? (
        <Text style={styles.hint}>тап · удаан барих · 2 дарах</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  holdGlow: {
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    bottom: -18,
    ...typography.body.sm,
    color: colors.warning,
    fontWeight: '600',
  },
  hint: {
    ...typography.body.sm,
    color: colors.text.muted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
