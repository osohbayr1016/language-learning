import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { lessonHtmlImportStyles as styles } from './AdminLessonHtmlImportStyles';

type Props = {
  disabled: boolean;
  /** ZIP сонгогдсон */
  zipName: string | null;
  onPickZip: () => void;
  /** Илгээх → серверт урьдчилан шалгах */
  onUploadZip: () => void;
  /** 0–100 эсвэл idle-д null */
  uploadPercent: number | null;
  uploadBusy: boolean;
};

export function AdminLessonZipImportBar({
  disabled,
  zipName,
  onPickZip,
  onUploadZip,
  uploadPercent,
  uploadBusy,
}: Props) {
  const busy = uploadBusy;
  const canUpload = Boolean(zipName) && !busy;
  const showProgress = uploadBusy;
  const pct = Math.min(100, Math.max(0, uploadPercent ?? 0));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>ZIP (lesson_data.json + audio/)</Text>
      <Text style={styles.hint}>APP_READY_SMALL багцыг .zip болгож оруулна. «Илгээх» товчоор серверт илгээж урьдчилна.</Text>
      <View style={styles.row}>
        <Pressable disabled={disabled || busy} style={[styles.btnSec, busy && styles.btnDis]} onPress={onPickZip}>
          <Text style={styles.btnSecText}>ZIP сонгох</Text>
        </Pressable>
        <Pressable
          disabled={disabled || busy || !canUpload}
          style={[styles.btn, (!canUpload || busy) && styles.btnDis]}
          onPress={onUploadZip}
        >
          <Text style={styles.btnText}>{uploadBusy ? 'Илгээж байна…' : 'Илгээх'}</Text>
        </Pressable>
      </View>
      {zipName ? <Text style={styles.stat}>{zipName}</Text> : null}
      {showProgress ? (
        <View style={styles.progressWrap} accessibilityRole="progressbar">
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{pct}%</Text>
        </View>
      ) : null}
    </View>
  );
}
