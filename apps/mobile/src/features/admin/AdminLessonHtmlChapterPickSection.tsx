import React, { useMemo } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { AdminChapter } from '../../lib/api/admin';
import { colors } from '../../theme';
import { buildChapterPickRows } from './adminLessonHtmlChapterRows';
import { lessonHtmlImportStyles as styles } from './AdminLessonHtmlImportStyles';

function chapterLabel(ch: AdminChapter) {
  return `HSK ${ch.jlpt_level} · ${ch.title_mn}`;
}

type Props = {
  token: string | null;
  chapters: AdminChapter[];
  chapterId: number | null;
  creatingHsk: number | null;
  onSelectChapter: (id: number) => void;
  onCreateChapterForHsk: (hsk: number) => void;
};

export function AdminLessonHtmlChapterPickSection({
  token,
  chapters,
  chapterId,
  creatingHsk,
  onSelectChapter,
  onCreateChapterForHsk,
}: Props) {
  const chapterRows = useMemo(() => buildChapterPickRows(chapters), [chapters]);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Бүлэг сонгох (HSK 1–6)</Text>
      <Text style={styles.hint}>Дараагийн HSK-д бүлэг байхгүй бол «Бүлэг үүсгэх» чип дээр дарна уу — бүлэг серверт нэмэгдэнэ.</Text>
      <View style={styles.row}>
        {chapterRows.map((row) =>
          row.type === 'missing' ? (
            <Pressable
              key={`missing-${row.hsk}`}
              accessibilityRole="button"
              accessibilityLabel={`HSK ${row.hsk} бүлэг үүсгэх`}
              disabled={!token || creatingHsk != null}
              style={[
                styles.chip,
                styles.chipCreate,
                (!token || creatingHsk != null) && styles.btnDis,
                creatingHsk === row.hsk && styles.chipOn,
              ]}
              onPress={() => onCreateChapterForHsk(row.hsk)}
            >
              {creatingHsk === row.hsk ? (
                <ActivityIndicator color={colors.brand.primary} />
              ) : (
                <Text style={styles.chipText}>HSK {row.hsk} · Бүлэг үүсгэх</Text>
              )}
            </Pressable>
          ) : (
            <Pressable
              key={row.chapter.id}
              accessibilityRole="button"
              style={[styles.chip, row.chapter.id === chapterId && styles.chipOn]}
              onPress={() => onSelectChapter(row.chapter.id)}
            >
              <Text style={styles.chipText}>{chapterLabel(row.chapter)}</Text>
            </Pressable>
          )
        )}
      </View>
    </View>
  );
}
