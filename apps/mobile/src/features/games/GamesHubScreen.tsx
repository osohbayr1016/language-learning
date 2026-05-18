import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { GameType } from '../../lib/api/games';
import type { HskLevel } from '../../lib/types';
import { GamesXpStrip } from './GamesXpStrip';
import { GamesStatsStrip } from './GamesStatsStrip';
import { useGamesStats } from './useGamesStats';
import { useLessonChapters } from '../lessons/useLessonChapters';
import { chaptersForLessonPrepPicker } from '../lessons/lessonPathUtils';
import { GamesLessonHskSection } from './GamesLessonHskSection';
import { GamesLessonPickerModal } from './GamesLessonPickerModal';
import { GamesHubPlayModal } from './GamesHubPlayModal';
import { GamesHubModesSection } from './GamesHubModesSection';

export default function GamesHubScreen() {
  const { data, refresh } = useGamesStats();
  const { chapters, loading: chaptersLoading } = useLessonChapters();
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerHsk, setPickerHsk] = useState<HskLevel | null>(null);
  const [playKey, setPlayKey] = useState<GameType | null>(null);
  const [playSession, setPlaySession] = useState(0);

  const pickerChapters = useMemo(
    () => chaptersForLessonPrepPicker(chapters, pickerHsk),
    [chapters, pickerHsk]
  );

  const startPlay = (key: GameType) => {
    setPlaySession((n) => n + 1);
    setPlayKey(key);
  };

  const closePlay = () => {
    setPlayKey(null);
    void refresh();
  };

  const playOpen = playKey != null && lessonId != null;

  return (
    <Screen scroll scrollBottomInset={70}>
      <View style={styles.pageHead}>
        <Text style={styles.pageTitle}>{mn.tabs.games}</Text>
      </View>

      <View style={styles.lessonBlock}>
        <Text style={styles.sectionHeading}>{mn.games.pickLesson}</Text>
        <GamesLessonHskSection
          onPickLevel={(lv) => {
            setPickerHsk(lv);
            setPickerOpen(true);
          }}
        />
        <View style={styles.scope}>
          <Text style={styles.scopeLabel} numberOfLines={4}>
            {lessonTitle
              ? `${mn.games.lessonScopeLabel}: ${lessonTitle}`
              : mn.games.hubPickLessonHint}
          </Text>
          {lessonTitle ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={mn.games.clearLesson}
              onPress={() => {
                setLessonId(null);
                setLessonTitle(null);
              }}
            >
              <Text style={styles.clearTxt}>{mn.games.clearLesson}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <GamesHubModesSection lessonId={lessonId} stats={data} onStartPlay={startPlay} />

      <GamesXpStrip />
      <GamesStatsStrip data={data} />

      <GamesLessonPickerModal
        visible={pickerOpen}
        chapters={pickerChapters}
        loading={chaptersLoading}
        onClose={() => {
          setPickerOpen(false);
          setPickerHsk(null);
        }}
        onSelectLesson={(id, titleMn) => {
          setLessonId(id);
          setLessonTitle(titleMn);
          setPickerOpen(false);
          setPickerHsk(null);
        }}
      />

      <GamesHubPlayModal
        visible={playOpen}
        gameKey={playKey}
        lessonId={lessonId}
        sessionKey={playSession}
        onClose={closePlay}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageHead: {
    paddingTop: spacing.md,
    marginBottom: spacing.sm,
  },
  pageTitle: {
    ...typography.heading.xl,
    color: colors.text.primary,
  },
  lessonBlock: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  scope: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  scopeLabel: {
    ...typography.body.sm,
    color: colors.text.secondary,
  },
  clearTxt: {
    ...typography.body.sm,
    color: colors.brand.primary,
    fontWeight: '700',
    alignSelf: 'flex-start',
  },
});
