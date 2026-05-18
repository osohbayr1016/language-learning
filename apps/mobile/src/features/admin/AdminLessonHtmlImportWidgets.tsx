import { Pressable, Text, View } from 'react-native';
import type { Href } from 'expo-router';
import type { LessonHtmlImportResult, LessonHtmlPreview } from '../../lib/api/admin';
import { lessonHtmlImportStyles as styles } from './AdminLessonHtmlImportStyles';

export function PreviewCard({ p }: { p: LessonHtmlPreview }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{p.title_cn || p.title_mn}</Text>
      <Text style={styles.hint}>{p.title_mn}</Text>
      <Text style={styles.stat}>ID: {p.external_lesson_id}</Text>
      <Text style={styles.stat}>Үг: {p.vocab_count} · Диалог: {p.dialogue_count}</Text>
      <Text style={styles.stat}>Grammar: {p.grammar_count} · Workbook: {p.workbook_count}</Text>
    </View>
  );
}

export function ResultCard({
  r,
  onOpen,
}: {
  r: LessonHtmlImportResult;
  onOpen: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Импорт дууслаа</Text>
      <Text style={styles.stat}>Lesson #{r.lesson_id}</Text>
      <Text style={styles.stat}>Шинэ үг: {r.inserted_words} · Давхардсан: {r.reused_words}</Text>
      <Text style={styles.stat}>Холбосон үг: {r.linked_words}</Text>
      <Pressable style={styles.btnSec} onPress={onOpen}>
        <Text style={styles.btnSecText}>Хичээл засах</Text>
      </Pressable>
    </View>
  );
}

export function openLessonEditHref(lessonId: number): Href {
  return `/admin/lesson/${lessonId}` as Href;
}
