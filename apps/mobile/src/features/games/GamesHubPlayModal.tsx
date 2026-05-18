import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { GameType } from '../../lib/api/games';
import { colors, spacing, typography } from '../../theme';
import { gameByKey } from './registry';
import { GamesHubPlayBody } from './GamesHubPlayBody';

type Props = {
  visible: boolean;
  gameKey: GameType | null;
  lessonId: number | null;
  sessionKey: number;
  onClose: () => void;
};

export function GamesHubPlayModal({ visible, gameKey, lessonId, sessionKey, onClose }: Props) {
  const open = visible && gameKey != null && lessonId != null;
  const title = gameKey != null ? gameByKey(gameKey).title : '';

  return (
    <Modal visible={open} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      {open ? (
        <SafeAreaView style={styles.safe} edges={['top']}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} hitSlop={14}>
              <Ionicons name="close" size={28} color={colors.text.primary} />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.body}>
            <GamesHubPlayBody key={sessionKey} gameKey={gameKey} lessonId={lessonId} />
          </View>
        </SafeAreaView>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { ...typography.heading.md, color: colors.text.primary, flex: 1, textAlign: 'center' },
  headerSpacer: { width: 28 },
  body: { flex: 1 },
});
