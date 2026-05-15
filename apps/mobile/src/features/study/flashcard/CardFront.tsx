import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ToneColoredText, PinyinRow } from "../../../components/hanzi";
import { useDisplayPrefs } from "../../../context/DisplayPrefsContext";
import { PronounceButton } from "../../../components/audio/PronounceButton";
import { colors, spacing, typography } from "../../../theme";
import { mn } from "../../../i18n/mn";
import type { WordWithProgress } from "../../../lib/types";

type Props = { word: WordWithProgress };

export function CardFront({ word }: Props) {
  const { showPinyin } = useDisplayPrefs();

  return (
    <View style={styles.wrap}>
      <ToneColoredText hanzi={word.kanji} tones={undefined} size="xl" />
      {showPinyin && word.romaji ? <PinyinRow pinyin={word.romaji} size="md" /> : null}
      <View style={styles.listenBlock}>
        <PronounceButton wordId={word.id} meaningMn={word.meaning_mn} size="lg" />
        <Text style={styles.backHint}>{mn.study.meaningOnBack}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
    gap: spacing.md,
  },
  listenBlock: { marginTop: spacing.lg, alignItems: "center", gap: spacing.sm },
  backHint: {
    ...typography.body.sm,
    color: colors.text.muted,
    textAlign: "center",
  },
});
