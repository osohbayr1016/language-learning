import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Word } from '../../lib/types';
import {
  getSpeechDisplay,
  speechRecognitionHints,
  type SpeechPromptScope,
} from '../../lib/audio/speechCardTargets';
import { ensureSpeechPermission, useSpeechSession } from '../../lib/audio/speech';
import { scoreMandarinUtterance } from '../../lib/audio/speechScoring';
import { mn } from '../../i18n/mn';
import { SayFallback } from '../../features/lessons/exercises/SayFallback';
import { SpeakMicPanel } from './SpeakMicPanel';
import { SpeakSuccessCelebration } from './SpeakSuccessCelebration';
import { SpeakWordCardFace } from './SpeakWordCardFace';
import { useSpeakWordSessionReset } from './useSpeakWordSessionReset';

type Props = { word: Word; disabled?: boolean; speechPrompt?: SpeechPromptScope; onEvaluated: (p: boolean) => void; onScore?: (n: number) => void };

export function MandarinSpeechCard({ word, disabled, speechPrompt = 'word', onEvaluated, onScore }: Props) {
  const { hanzi: target, pinyin: pinyinLine, tones } = getSpeechDisplay(word, speechPrompt);
  const { state, result, liveTranscript, errorMessage, reset, supported, start, stop } =
    useSpeechSession();
  const activeMic = state === 'listening' || state === 'requesting';
  const [submitted, setSubmitted] = useState(false);
  const [points, setPoints] = useState<number | null>(null);
  const [passedRound, setPassedRound] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<string | null>(null);
  const [finalLine, setFinalLine] = useState<string | null>(null);
  const [celebrateStamp, setCelebrateStamp] = useState(0);
  const onEvalRef = useRef(onEvaluated);
  const onScoreRef = useRef(onScore);
  onEvalRef.current = onEvaluated;
  onScoreRef.current = onScore;

  const resetRoundUi = useCallback(() => {
    setSubmitted(false);
    setPoints(null);
    setPassedRound(null);
    setTranscript(null);
    setBreakdown(null);
    setFinalLine(null);
    setCelebrateStamp(0);
  }, []);

  useSpeakWordSessionReset(word.id, stop, reset, resetRoundUi);

  useLayoutEffect(() => {
    if (!result || submitted) return;
    const ev = scoreMandarinUtterance(result.transcript, target, pinyinLine);
    setPoints(ev.points);
    setTranscript(result.transcript.trim());
    setFinalLine(mn.study.speakFinalGrade.replace('{n}', String(ev.finalPercent)));
    setBreakdown(
      mn.study.speakAggregate
        .replace('{h}', String(Math.round(ev.hanziRatio * 100)))
        .replace('{p}', String(Math.round(ev.pinyinRatio * 100)))
    );
    setPassedRound(ev.pass);
    setSubmitted(true);
    if (ev.pass) setCelebrateStamp((s) => s + 1);
    onEvalRef.current(ev.pass);
    onScoreRef.current?.(ev.finalPercent);
  }, [result, submitted, target, pinyinLine]);

  const onMicPress = async () => {
    if (submitted || disabled || state === 'processing') return;
    if (activeMic) {
      stop();
      return;
    }
    const granted = await ensureSpeechPermission();
    if (!granted) {
      onEvalRef.current(false);
      onScoreRef.current?.(0);
      setSubmitted(true);
      setPoints(0);
      setPassedRound(false);
      setTranscript(null);
      setBreakdown('Зөвшөөрөл аваагүй');
      setFinalLine(mn.study.speakFinalGrade.replace('{n}', '0'));
      return;
    }
    reset();
    setSubmitted(false);
    setPassedRound(null);
    setPoints(null);
    setTranscript(null);
    setBreakdown(null);
    setFinalLine(null);
    start(speechRecognitionHints(word, target));
  };

  const outcome =
    submitted && points !== null
      ? [
          `Оноо: ${points}/100`,
          transcript ? `Таны хэлсэн: «${transcript}»` : '',
          finalLine ?? '',
          breakdown ?? '',
          passedRound ? 'Дүнд: Тэнцсэн' : 'Дүнд: Тэнцээгүй',
        ]
          .filter(Boolean)
          .join('\n')
      : 'Микрофон дараад өгүүлбэрийг хятадаар хэлээрэй';

  return (
    <View style={styles.root}>
      <SpeakWordCardFace
        word={word}
        hanzi={target}
        pinyin={pinyinLine}
        tones={tones}
        exampleAside={
          speechPrompt === 'word' && word.example_zh && word.example_zh !== word.hanzi
            ? mn.study.speakExampleHint.replace('{s}', word.example_zh)
            : null
        }
      />

      {supported ? (
        <SpeakMicPanel
          disabled={!!disabled}
          submitted={submitted}
          processing={state === 'processing'}
          activeMic={activeMic}
          onMicPress={() => void onMicPress()}
          liveTranscript={liveTranscript}
          outcome={outcome}
          errorMessage={errorMessage}
        />
      ) : (
        <SayFallback
          disabled={disabled || submitted}
          onSpoken={() => {
            setSubmitted(true);
            onEvaluated(true);
          }}
          onSkip={() => {
            setSubmitted(true);
            onEvaluated(false);
          }}
        />
      )}
      <SpeakSuccessCelebration stamp={celebrateStamp} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'space-between', position: 'relative' },
});
