import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import { useAuth } from '../../../context/AuthContext';
import { mn } from '../../../i18n/mn';
import { fetchLessonSessionDetail } from '../fetchLessonSessionDetail';
import type { ImportedWorkbookItem } from '../../../lib/types';
import { collectInteractiveWorkbookQuizItems } from './collectInteractiveWorkbookQuizItems';
import { WorkbookPracticeQuizFlow } from './WorkbookPracticeQuizFlow';

function shuffleQuestions(list: ImportedWorkbookItem[]): ImportedWorkbookItem[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function WorkbookPracticeScreen({
  lessonId,
  adminLessonPreview = false,
  onExit,
}: {
  lessonId: number;
  /** Use `/api/admin/lessons/:id/preview` — required for admin lesson preview flow. */
  adminLessonPreview?: boolean;
  onExit: () => void;
}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [titleMn, setTitleMn] = useState('');
  const [items, setItems] = useState<ImportedWorkbookItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetchLessonSessionDetail({
          lessonId,
          token,
          adminPreview: adminLessonPreview,
        });
        const content = res.data.imported_content;
        if (!content) throw new Error('no_import');
        const pool = shuffleQuestions(collectInteractiveWorkbookQuizItems(content));
        if (cancelled) return;
        setTitleMn(res.data.title_mn);
        setItems(pool);
      } catch {
        if (!cancelled) setErr(mn.lesson.workbookPractice.empty);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, token, adminLessonPreview]);

  const ready = useMemo(() => items && items.length > 0, [items]);

  if (loading) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      </Screen>
    );
  }

  if (err || !ready || !items) {
    return (
      <Screen edges={['top', 'bottom']} scroll>
        <View style={styles.center}>
          <Text style={styles.err}>{err ?? mn.lesson.workbookPractice.empty}</Text>
          <Button label={mn.common.back} onPress={onExit} variant="secondary" />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']} padded={false}>
      <WorkbookPracticeQuizFlow
        items={items}
        lessonTitleMn={titleMn || mn.lesson.workbookPractice.title}
        onExit={onExit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  err: { ...typography.body.md, color: colors.text.secondary, textAlign: 'center' },
});
