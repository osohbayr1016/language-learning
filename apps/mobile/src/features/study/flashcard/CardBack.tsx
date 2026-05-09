import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ToneColoredText, PinyinRow } from "../../../components/hanzi";
import { PronounceButton } from "../../../components/audio/PronounceButton";
import { parseTones } from "../../../lib/tones";
import { colors, spacing, typography } from "../../../theme";
import { useDisplayPrefs } from "../../../context/DisplayPrefsContext";
import type { WordWithProgress } from "../../../lib/types";

type Props = { word: WordWithProgress };

export function CardBack({ word }: Props) {
  const { showPinyin } = useDisplayPrefs();
  const tones = parseTones(word.tones);

  return (
    <View style={styles.wrap}>
      <ToneColoredText hanzi={word.hanzi} tones={tones} size="lg" />
      {showPinyin ? <PinyinRow pinyin={word.pinyin} size="lg" /> : null}
      <Text style={styles.meaning}>{word.meaning_mn}</Text>
      {word.example_zh ? (
        <View style={styles.example}>
          <Text style={styles.exampleZh}>{word.example_zh}</Text>
          {showPinyin && word.example_pinyin ? (
            <Text style={styles.examplePinyin}>{word.example_pinyin}</Text>
          ) : null}
          {word.example_mn ? (
            <Text style={styles.exampleMn}>{word.example_mn}</Text>
          ) : null}
        </View>
      ) : null}
      <View style={{ marginTop: spacing.md }}>
        <PronounceButton wordId={word.id} size="md" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    gap: spacing.sm,
  },
  meaning: {
    ...typography.heading.lg,
    color: colors.text.primary,
    textAlign: "center",
    marginVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    maxWidth: "100%",
    flexShrink: 1,
  },
  example: {
    backgroundColor: colors.bg.elevated,
    borderRadius: 12,
    padding: spacing.md,
    width: "100%",
    maxWidth: "100%",
    gap: 4,
    marginTop: spacing.sm,
    flexShrink: 1,
  },
  exampleZh: {
    ...typography.heading.md,
    color: colors.text.primary,
    textAlign: "center",
    flexShrink: 1,
    maxWidth: "100%",
  },
  examplePinyin: {
    ...typography.pinyin.md,
    color: colors.text.secondary,
    textAlign: "center",
    flexShrink: 1,
    maxWidth: "100%",
  },
  exampleMn: {
    ...typography.body.md,
    color: colors.text.secondary,
    textAlign: "center",
    flexShrink: 1,
    maxWidth: "100%",
  },
});
