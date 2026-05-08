import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

type Props = {
  hanzi: string;
  pinyin: string;
  meaningMn: string;
  onHanzi: (v: string) => void;
  onPinyin: (v: string) => void;
  onMeaningMn: (v: string) => void;
};

export function AdminHanziCoreWordInputs({
  hanzi,
  pinyin,
  meaningMn,
  onHanzi,
  onPinyin,
  onMeaningMn,
}: Props) {
  return (
    <View>
      <Text style={styles.label}>Ханз (үг эсвэл нэг тэмдэгт)</Text>
      <TextInput value={hanzi} onChangeText={onHanzi} style={styles.input} />
      <Text style={styles.label}>Pinyin</Text>
      <TextInput value={pinyin} onChangeText={onPinyin} style={styles.input} autoCapitalize="none" />
      <Text style={styles.label}>Монгол утга</Text>
      <TextInput value={meaningMn} onChangeText={onMeaningMn} style={styles.input} multiline />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.body.sm, color: colors.text.secondary, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
    color: colors.text.primary,
    backgroundColor: colors.bg.card,
  },
});
