import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExerciseCard } from '../ExerciseCard';
import { FeedbackBanner } from '../FeedbackBanner';
import { exerciseCorrectAnswer } from '../exercises';
import { ImportedWorkbookCard } from '../exercises/ImportedWorkbookCard';
import type { Exercise } from '../types';
import type { ImportedWorkbookItem } from '../../../lib/types';
import { LessonHeader } from '../LessonHeader';
import { mn } from '../../../i18n/mn';
import { spacing } from '../../../theme';
import { WorkbookPracticeDonePanel } from './WorkbookPracticeDonePanel';

function toExercise(
  item: ImportedWorkbookItem,
  pos: number,
  total: number
): Extract<Exercise, { kind: 'imported-workbook' }> {
  return {
    kind: 'imported-workbook',
    id: `wp-q-${pos}`,
    sectionTitle: `${mn.lesson.workbookPractice.roundLabel} ${pos + 1}/${total}`,
    sectionType: 'workbook-practice',
    item,
  };
}

export function WorkbookPracticeQuizFlow({
  items,
  lessonTitleMn,
  onExit,
}: {
  items: ImportedWorkbookItem[];
  lessonTitleMn: string;
  onExit: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [banner, setBanner] = useState<{ correct: boolean } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const total = items.length;

  const currentEx = useMemo(() => {
    const item = items[idx];
    if (!item || idx >= total) return null;
    return toExercise(item, idx, total);
  }, [idx, items, total]);

  if (total === 0) return null;

  if (done) {
    return (
      <WorkbookPracticeDonePanel correctCount={correctCount} total={total} onExit={onExit} />
    );
  }

  if (!currentEx) return null;

  const progress = total > 0 ? (idx + (banner ? 1 : 0)) / total : 0;

  return (
    <View style={styles.flex}>
      <View style={styles.head}>
        <LessonHeader
          progress={progress}
          onClose={onExit}
          onMore={() => {}}
          showTrailingMenu={false}
        />
      </View>

      <View style={styles.body}>
        <ExerciseCard title={lessonTitleMn} prompt={mn.lesson.workbookPractice.title}>
          <ImportedWorkbookCard
            key={currentEx.id}
            exercise={currentEx}
            disabled={!!banner}
            onAnswer={(ok) => {
              setBanner({ correct: ok });
              if (ok) setCorrectCount((n) => n + 1);
            }}
          />
        </ExerciseCard>
      </View>

      <FeedbackBanner
        visible={!!banner}
        correct={banner?.correct ?? false}
        correctAnswer={exerciseCorrectAnswer(currentEx)}
        onContinue={() => {
          setBanner(null);
          if (idx + 1 >= total) setDone(true);
          else setIdx((i) => i + 1);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  head: { paddingHorizontal: spacing.lg },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
});
