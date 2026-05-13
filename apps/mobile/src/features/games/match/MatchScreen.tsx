import React, { useEffect, useMemo, useState, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Screen } from '../../../primitives';
import { useRandomWords } from '../../../hooks/useRandomWords';
import { useGameSession } from '../../../hooks/useGameSession';
import { useAudio } from '../../../context/AudioContext';
import { colors, spacing } from '../../../theme';
import { mn } from '../../../i18n/mn';
import { GameHud } from '../GameHud';
import { GameOverScreen } from '../GameOverScreen';
import { buildMatchDeck, type MatchCard } from './cards';
import { MatchTile } from './MatchTile';

const PAIRS = 6;

export default function MatchScreen() {
  const { words, loading } = useRandomWords(PAIRS);
  const { save } = useGameSession();
  const { playWord } = useAudio();

  const [deck, setDeck] = useState<MatchCard[]>([]);
  const [selected, setSelected] = useState<MatchCard | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [start, setStart] = useState<number>(Date.now());
  const [done, setDone] = useState(false);
  const [combo, setCombo] = useState(1);
  const comboTimer = useRef<NodeJS.Timeout | null>(null);
  const [, bumpTick] = useState(0);

  useEffect(() => {
    if (words.length > 0) {
      setDeck(buildMatchDeck(words));
      setStart(Date.now());
    }
  }, [words]);

  useEffect(() => {
    if (loading || done || deck.length === 0) return;
    const id = setInterval(() => bumpTick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [loading, done, deck.length]);

  const wordsById = useMemo(
    () => Object.fromEntries(words.map((w) => [w.id, w])),
    [words]
  );

  const total = words.length;
  const elapsedSeconds =
    !loading && deck.length > 0 && !done ? Math.max(0, Math.floor((Date.now() - start) / 1000)) : null;

  const restartMidRound = () => {
    if (words.length === 0) return;
    setDeck(buildMatchDeck(words));
    setMatchedPairs(0);
    setScore(0);
    setCombo(1);
    setSelected(null);
    setWrong([]);
    setStart(Date.now());
  };

  const finish = async () => {
    const elapsed = Math.max(1, Math.round((Date.now() - start) / 1000));
    const xp = Math.round(score / 5);
    await save({
      game_type: 'match',
      score,
      accuracy: total > 0 ? matchedPairs / total : 0,
      duration_seconds: elapsed,
      words_practiced: total,
      xp_earned: xp,
    });
    setDone(true);
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}><ActivityIndicator color={colors.accent.purple} /></View>
      </Screen>
    );
  }

  if (done) {
    return (
      <GameOverScreen
        score={score}
        xp={Math.round(score / 5)}
        durationSeconds={Math.round((Date.now() - start) / 1000)}
        onPlayAgain={() => {
          setDeck(buildMatchDeck(words));
          setMatchedPairs(0);
          setScore(0);
          setCombo(1);
          setSelected(null);
          setWrong([]);
          setStart(Date.now());
          setDone(false);
        }}
      />
    );
  }

  const resetComboTimer = () => {
    if (comboTimer.current) clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => {
      setCombo(1);
    }, 4000); // 4 seconds to keep combo alive
  };

  const handleTap = (card: MatchCard) => {
    if (selected?.id === card.id) return;
    if (!selected) {
      setSelected(card);
      void Haptics.selectionAsync();
      return;
    }
    
    if (selected.wordId === card.wordId && selected.type !== card.type) {
      // Match!
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setDeck((d) => d.map((c) => (c.wordId === card.wordId ? { ...c, matched: true } : c)));
      setSelected(null);
      
      const points = 10 * combo;
      setScore((s) => s + points);
      setCombo((c) => Math.min(c + 1, 5)); // max combo x5
      resetComboTimer();
      
      const next = matchedPairs + 1;
      setMatchedPairs(next);
      void playWord(card.wordId);
      
      if (next >= total) {
        if (comboTimer.current) clearTimeout(comboTimer.current);
        void finish();
      }
    } else {
      // Wrong match
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setWrong([selected.id, card.id]);
      setSelected(null);
      setCombo(1);
      setScore((s) => Math.max(0, s - 2));
      setTimeout(() => setWrong([]), 600);
    }
  };

  const stateOf = (c: MatchCard): 'idle' | 'selected' | 'matched' | 'wrong' => {
    if (c.matched) return 'matched';
    if (wrong.includes(c.id)) return 'wrong';
    if (selected?.id === c.id) return 'selected';
    return 'idle';
  };

  return (
    <Screen scroll>
      <GameHud
        title={mn.games.match}
        score={score}
        combo={combo}
        elapsedSeconds={elapsedSeconds}
        onRestart={restartMidRound}
        progressLabel={`${matchedPairs}/${total}`}
      />
      <View style={styles.grid}>
        {deck.map((c) => (
          <MatchTile
            key={c.id}
            card={c}
            word={wordsById[c.wordId]}
            state={stateOf(c)}
            onPress={() => handleTap(c)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
