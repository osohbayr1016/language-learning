import React, { useState } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { useAudio } from '../../context/AudioContext';
import { colors } from '../../theme';
import { gestureToAction, type GestureKind } from '../../lib/audio/engine';
import { pronounceButtonStyles as styles } from './pronounceButtonStyles';

type Props = {
  wordId: number;
  /** Монгол орчуулгыг төхөөрөмжөөр унших */
  meaningMn?: string;
  /** Гол үгийн ханз; displayText-тэй хамт өгөгдөхөд өгүүлбэрийн дуу сонсогдоно */
  wordHanzi?: string;
  /** Картад харуулж буй бүтэн текст (жишээ өгүүлбэр) */
  displayText?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: ViewStyle;
  showHints?: boolean;
};

export function PronounceButton({
  wordId,
  meaningMn,
  wordHanzi,
  displayText,
  size = 'md',
  color = colors.accent.purple,
  style,
  showHints = false,
}: Props) {
  const { playWord, playPhrase, playMeaningMn } = useAudio();
  const [active, setActive] = useState<'idle' | 'tap' | 'hold' | 'doubleTap'>('idle');

  const useFullPhrase =
    typeof displayText === 'string' &&
    typeof wordHanzi === 'string' &&
    displayText.trim().length > 0 &&
    displayText.trim() !== wordHanzi.trim();

  const handle = async (kind: GestureKind) => {
    setActive(kind);
    const a = gestureToAction(kind);
    const opts =
      a.kind === 'doubleTap' ? { speed: a.speed, repeat: a.repeat } : { speed: a.speed };
    if (useFullPhrase) {
      await playPhrase(displayText!.trim(), opts);
    } else if (a.kind === 'doubleTap') {
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

  const mnTrim = typeof meaningMn === 'string' ? meaningMn.trim() : '';

  return (
    <View style={[styles.wrap, style]}>
      <View style={styles.row}>
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

      </View>
      {showHints ? (
        <Text style={styles.hint}>
          тап · удаан барих · 2 дарах
        </Text>
      ) : null}
    </View>
  );
}
