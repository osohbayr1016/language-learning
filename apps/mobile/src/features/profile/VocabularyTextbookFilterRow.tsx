import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { mn } from '../../i18n/mn';
import { colors, spacing, typography } from '../../theme';

type Props = {
  draft: string;
  onDraft: (v: string) => void;
  onApply: () => void;
  disabled?: boolean;
};

export function VocabularyTextbookFilterRow({ draft, onDraft, onApply, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{mn.profile.vocabTextbookFilter}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={mn.profile.vocabTextbookPlaceholder}
          value={draft}
          onChangeText={onDraft}
          autoCapitalize="none"
          editable={!disabled}
        />
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onApply}
          style={({ pressed }) => [
            styles.btn,
            pressed && Platform.OS !== 'web' ? { opacity: 0.9 } : null,
          ]}
        >
          <Text style={styles.btnTxt}>{mn.profile.vocabApplyFilter}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { ...typography.body.sm, color: colors.text.secondary, marginBottom: 4 },
  row: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    color: colors.text.primary,
    backgroundColor: colors.bg.card,
  },
  btn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bg.elevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnTxt: { ...typography.body.sm, fontWeight: '700', color: colors.text.primary },
});
