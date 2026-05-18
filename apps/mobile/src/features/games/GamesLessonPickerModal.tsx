import React from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import type { Chapter } from '../../lib/types';
import { GamesLessonPickerModalList } from './GamesLessonPickerModalList';

type Props = {
  visible: boolean;
  chapters: Chapter[];
  loading: boolean;
  onClose: () => void;
  onSelectLesson: (id: number, titleMn: string) => void;
};

export function GamesLessonPickerModal({
  visible,
  chapters,
  loading,
  onClose,
  onSelectLesson,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{mn.games.pickLessonTitle}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={26} color={colors.text.primary} />
            </Pressable>
          </View>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={colors.brand.primary} />
              <Text style={styles.muted}>{mn.common.loading}</Text>
            </View>
          ) : (
            <GamesLessonPickerModalList chapters={chapters} onSelectLesson={onSelectLesson} />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '78%',
    backgroundColor: colors.bg.card,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { ...typography.heading.lg, color: colors.text.primary },
  loadingBox: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  muted: { ...typography.body.sm, color: colors.text.muted },
});
