import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Mode = 'animate' | 'quiz' | 'show';

type Props = {
  mode: Mode;
  onChange: (m: Mode) => void;
};

const TABS: { mode: Mode; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { mode: 'animate', label: mn.writer.watch, icon: 'play-circle-outline' },
  { mode: 'quiz', label: mn.writer.trace, icon: 'create-outline' },
  { mode: 'show', label: mn.common.done, icon: 'eye-outline' },
];

export function WriterControls({ mode, onChange }: Props) {
  return (
    <View style={styles.row}>
      {TABS.map((t) => {
        const active = t.mode === mode;
        return (
          <Pressable
            key={t.mode}
            onPress={() => onChange(t.mode)}
            style={[styles.tab, active && styles.active]}
          >
            <Ionicons
              name={t.icon}
              size={18}
              color={active ? colors.text.primary : colors.text.secondary}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.accent.purple },
  label: { ...typography.body.md, color: colors.text.secondary, fontWeight: '600' },
  activeLabel: { color: colors.text.primary },
});
