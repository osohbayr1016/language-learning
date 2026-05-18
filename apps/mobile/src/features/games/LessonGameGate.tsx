import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen } from '../../primitives';
import { colors } from '../../theme';
import { GameHud } from './GameHud';
import type { Word } from '../../lib/types';
import { GameLessonTooFew } from './GameLessonTooFew';

type P = {
  initialWords?: Word[];
  loading: boolean;
  useLesson: boolean;
  lessonErr: string | null;
  words: Word[];
  canPlay: boolean;
  tooFewMessage: string;
  emptyTitle: string;
  /** When set, show empty HUD if true (e.g. sentence game with no rows with examples). */
  playlistEmpty?: boolean;
  children: React.ReactNode;
};

/** Loading + lesson-scoped gates (shared by match / translate / sentence). */
export function LessonGameGate({
  initialWords,
  loading,
  useLesson,
  lessonErr,
  words,
  canPlay,
  tooFewMessage,
  emptyTitle,
  playlistEmpty,
  children,
}: P) {
  if (!initialWords && loading) {
    return (
      <Screen>
        <View style={styles.center}><ActivityIndicator color={colors.accent.purple} /></View>
      </Screen>
    );
  }
  if (useLesson && lessonErr) {
    return <GameLessonTooFew message={lessonErr} />;
  }
  if (useLesson && !loading && !canPlay) {
    return <GameLessonTooFew message={tooFewMessage} />;
  }
  const isEmpty =
    playlistEmpty !== undefined ? playlistEmpty : words.length === 0;
  if (isEmpty) {
    return (
      <Screen>
        <View style={styles.center}>
          <GameHud title={emptyTitle} score={0} />
        </View>
      </Screen>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
