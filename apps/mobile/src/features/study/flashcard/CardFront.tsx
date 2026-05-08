import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ToneColoredText, ToneBar, PinyinRow } from "../../../components/hanzi";
import { useDisplayPrefs } from "../../../context/DisplayPrefsContext";
import { PronounceButton } from "../../../components/audio/PronounceButton";
import { parseTones } from "../../../lib/tones";
import { colors, spacing, typography } from "../../../theme";
import { mn } from "../../../i18n/mn";
import type { WordWithProgress } from "../../../lib/types";

type Props = { word: WordWithProgress };

export function CardFront({ word }: Props) {
  const { showPinyin } = useDisplayPrefs();
  const tones = parseTones(word.tones);
  const firstTone = tones[0] ?? 0;

  return (
    <View style={styles.wrap}>
      <ToneColoredText hanzi={word.hanzi} tones={tones} size="xl" />
      {showPinyin && word.pinyin ? <PinyinRow pinyin={word.pinyin} size="md" /> : null}
      <View style={styles.toneRow}>
        <ToneBar tone={firstTone} width={80} height={32} />
      </View>
      <View style={styles.listenBlock}>
        <PronounceButton wordId={word.id} size="lg" />
        <Text style={styles.backHint}>{mn.study.meaningOnBack}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  toneRow: { marginTop: spacing.sm },
  listenBlock: { marginTop: spacing.lg, alignItems: "center", gap: spacing.sm },
  backHint: {
    ...typography.body.sm,
    color: colors.text.muted,
    textAlign: "center",
  },
});
