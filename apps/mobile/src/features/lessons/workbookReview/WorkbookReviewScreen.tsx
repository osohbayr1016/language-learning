import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '../../../primitives';
import { colors, spacing, typography } from '../../../theme';
import { useAuth } from '../../../context/AuthContext';
import { mn } from '../../../i18n/mn';
import { fetchLessonSessionDetail } from '../fetchLessonSessionDetail';
import { collectWorkbookReviewRows } from './collectWorkbookReviewRows';
import { WorkbookReviewRow } from './WorkbookReviewRow';

export function WorkbookReviewScreen({
  lessonId,
  onExit,
}: {
  lessonId: number;
  onExit: () => void;
}) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [titleMn, setTitleMn] = useState('');

  const [rows, setRows] = useState<ReturnType<typeof collectWorkbookReviewRows>>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetchLessonSessionDetail({ lessonId, token, adminPreview: false });
        const content = res.data.imported_content;
        if (!content) throw new Error('no_import');
        const list = collectWorkbookReviewRows(content);
        if (cancelled) return;
        setTitleMn(res.data.title_mn);
        setRows(list);
      } catch {
        if (!cancelled) setErr(mn.lesson.workbookReview.empty);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, token]);

  const heading = titleMn || mn.lesson.workbookReview.title;

  const body = useMemo(() => {
    if (loading) return null;
    if (err) return <Text style={styles.err}>{err}</Text>;
    if (rows.length === 0) return <Text style={styles.err}>{mn.lesson.workbookReview.empty}</Text>;
    return rows.map((row, i) => <WorkbookReviewRow key={`wb-rev-${i}`} row={row} />);
  }, [loading, err, rows]);

  if (loading) {
    return (
      <Screen edges={['top', 'bottom']}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.brand.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'bottom']} scroll padded>
      <View style={styles.head}>
        <Button label={mn.common.back} onPress={onExit} variant="secondary" />
        <Text style={styles.title}>{heading}</Text>
        <Text style={styles.sub}>{mn.lesson.workbookReview.title}</Text>
      </View>
      {body}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  head: { paddingBottom: spacing.sm, gap: spacing.xs },
  title: { ...typography.heading.md, color: colors.text.primary },
  sub: { ...typography.body.sm, color: colors.text.secondary },
  err: { ...typography.body.md, color: colors.text.secondary, textAlign: 'center', paddingVertical: spacing.lg },
});
