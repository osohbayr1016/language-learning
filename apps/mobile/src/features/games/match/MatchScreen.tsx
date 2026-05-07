import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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

  useEffect(() => {
    if (words.length > 0) {
      setDeck(buildMatchDeck(words));
      setStart(Date.now());
    }
  }, [words]);

  const wordsById = useMemo(
    () => Object.fromEntries(words.map((w) => [w.id, w])),
    [words]
  );

  const total = words.length;

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
          setStart(Date.now());
          setDone(false);
        }}
      />
    );
  }

  const handleTap = (card: MatchCard) => {
    if (selected?.id === card.id) return;
    if (!selected) { setSelected(card); return; }
    if (selected.wordId === card.wordId && selected.type !== card.type) {
      setDeck((d) => d.map((c) => (c.wordId === card.wordId ? { ...c, matched: true } : c)));
      setSelected(null);
      setScore((s) => s + 10);
      const next = matchedPairs + 1;
      setMatchedPairs(next);
      void playWord(card.wordId);
      if (next >= total) void finish();
    } else {
      setWrong([selected.id, card.id]);
      setSelected(null);
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
