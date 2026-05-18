import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ImportedLessonContent, WordWithProgress } from '../../../lib/types';
import { useAudio } from '../../../context/AudioContext';
import { StrokeStepsModal } from '../../../components/writing/StrokeStepsModal';
import { colors, radius, spacing, typography } from '../../../theme';
import { mn } from '../../../i18n/mn';

type VocabRow = ImportedLessonContent['vocab'][number];

const styles = StyleSheet.create({
  block: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bg.secondary,
    gap: spacing.xs,
  },
  cnLine: { ...typography.body.md, color: colors.text.primary, fontWeight: '700', lineHeight: 24 },
  p: { ...typography.body.sm, color: colors.text.secondary, lineHeight: 21 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  pill: { alignSelf: 'flex-start', backgroundColor: '#FFE680', paddingHorizontal: 8, borderRadius: 999 },
  pillTxt: { fontSize: 11, fontWeight: '800' },
  iconBtn: { padding: spacing.xs },
  linkTxt: { ...typography.body.sm, color: colors.brand.primary, fontWeight: '700' },
});

function HskPill({ level }: { level: number }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillTxt}>HSK{level}</Text>
    </View>
  );
}

function firstGrapheme(s: string): string {
  const g = [...s.trim()];
  return g[0] ?? '';
}

export function VocabPane({
  rows,
  lessonWords,
}: {
  rows: VocabRow[];
  lessonWords?: WordWithProgress[];
}) {
  const { playWord } = useAudio();
  const [strokePopup, setStrokePopup] = useState<{ char: string; mountKey: number } | null>(null);
  const byHanzi = useMemo(() => {
    const m = new Map<string, WordWithProgress>();
    for (const w of lessonWords ?? []) {
      if (!m.has(w.hanzi)) m.set(w.hanzi, w);
    }
    return m;
  }, [lessonWords]);

  return (
    <>
      {rows.map((row, i) => {
        const w = byHanzi.get(row.hanzi);
        return (
          <View key={`${row.hanzi}-${i}`} style={styles.block}>
            <Text style={styles.cnLine}>{row.hanzi}</Text>
            <Text style={styles.p}>{row.pinyin}</Text>
            {row.radical ? (
              <Text style={styles.p}>
                {mn.lesson.radicalOnWord}: {row.radical}
              </Text>
            ) : null}
            <Text style={styles.p}>{row.meaning_mn}</Text>
            <View style={styles.row}>
              <HskPill level={row.hsk_level} />
              {w ? (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Дуудлага сонсох"
                    style={styles.iconBtn}
                    onPress={() => void playWord(w.id)}
                  >
                    <Ionicons name="volume-medium" size={22} color={colors.accent.purple} />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const ch = firstGrapheme(w.hanzi) || firstGrapheme(row.hanzi);
                      if (ch) setStrokePopup({ char: ch, mountKey: Date.now() });
                    }}
                  >
                    <Text style={styles.linkTxt}>Зураас</Text>
                  </Pressable>
                </>
              ) : null}
            </View>
          </View>
        );
      })}
      <StrokeStepsModal
        visible={strokePopup != null}
        char={strokePopup?.char ?? ''}
        mountKey={strokePopup?.mountKey ?? 0}
        onClose={() => setStrokePopup(null)}
      />
    </>
  );
}
