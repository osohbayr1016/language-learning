import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { lessonHtmlImportStyles as styles } from './AdminLessonHtmlImportStyles';

type Props = {
  disabled: boolean;
  zipImportBusy: boolean;
  importPercent: number | null;
  showImportProgress: boolean;
  onImport: () => void;
};

export function AdminLessonImportSubmitBlock({
  disabled,
  zipImportBusy,
  importPercent,
  showImportProgress,
  onImport,
}: Props) {
  const impPct = Math.min(100, Math.max(0, importPercent ?? 0));
  return (
    <>
      <Pressable disabled={disabled} style={[styles.btn, disabled && styles.btnDis]} onPress={onImport}>
        <Text style={styles.btnText}>{zipImportBusy ? 'Импортолж байна…' : 'Апп руу импортлох'}</Text>
      </Pressable>
      {showImportProgress ? (
        <View style={styles.progressWrap} accessibilityRole="progressbar">
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${impPct}%` }]} />
          </View>
          <Text style={styles.progressLabel}>Импорт {impPct}%</Text>
        </View>
      ) : null}
    </>
  );
}
