import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';

type Mode = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  href: string;
};

const MODES: Mode[] = [
  {
    key: 'flashcard',
    title: mn.study.flashcard,
    subtitle: mn.study.flashcardDesc,
    icon: 'albums-outline',
    color: colors.accent.purple,
    href: '/study/flashcard',
  },
  {
    key: 'learn',
    title: mn.study.learn,
    subtitle: mn.study.learnDesc,
    icon: 'school-outline',
    color: colors.accent.blue,
    href: '/study/learn',
  },
  {
    key: 'weak',
    title: mn.study.weakReviewTitle,
    subtitle: mn.study.weakReviewDesc,
    icon: 'fitness-outline',
    color: colors.error,
    href: '/study/weak',
  },
  {
    key: 'write',
    title: mn.study.write,
    subtitle: mn.study.writeDesc,
    icon: 'create-outline',
    color: colors.accent.teal,
    href: '/study/write',
  },
  {
    key: 'writer',
    title: mn.study.writer,
    subtitle: mn.study.writerDesc,
    icon: 'brush-outline',
    color: colors.accent.pink,
    href: '/study/writer',
  },
  {
    key: 'speak',
    title: mn.study.speak,
    subtitle: mn.study.speakDesc,
    icon: 'mic-outline',
    color: colors.success,
    href: '/study/speak',
  },
  {
    key: 'grammar',
    title: mn.study.grammarTitle,
    subtitle: mn.study.grammarDesc,
    icon: 'library-outline',
    color: colors.warning,
    href: '/study/grammar',
  },
  {
    key: 'mock',
    title: mn.study.mockExamTitle,
    subtitle: mn.study.mockExamDesc,
    icon: 'clipboard-outline',
    color: colors.accent.amber,
    href: '/study/mock-exam',
  },
];

function LargeCard({ mode, onPress }: { mode: Mode; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.largeCard, { borderColor: mode.color }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.largeIconBox, { backgroundColor: `${mode.color}1A` }]}>
        <Ionicons name={mode.icon} size={32} color={mode.color} />
      </View>
      <View style={styles.largeBody}>
        <Text style={styles.largeTitle}>{mode.title}</Text>
        <Text style={styles.largeSubtitle}>{mode.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={mode.color} />
    </Pressable>
  );
}

function HalfCard({ mode, onPress }: { mode: Mode; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.halfCard, { borderTopColor: mode.color }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.halfIconBox, { backgroundColor: `${mode.color}1A` }]}>
        <Ionicons name={mode.icon} size={24} color={mode.color} />
      </View>
      <Text style={styles.halfTitle} numberOfLines={1}>{mode.title}</Text>
      <Text style={styles.halfSubtitle} numberOfLines={2}>{mode.subtitle}</Text>
    </Pressable>
  );
}

function ListRow({ mode, onPress }: { mode: Mode; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.listRow, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.listIconBox, { backgroundColor: `${mode.color}1A` }]}>
        <Ionicons name={mode.icon} size={20} color={mode.color} />
      </View>
      <View style={styles.listBody}>
        <Text style={styles.listTitle}>{mode.title}</Text>
        <Text style={styles.listSubtitle} numberOfLines={1}>{mode.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
    </Pressable>
  );
}

export function StudyModeGrid() {
  const router = useRouter();

  const getMode = (key: string) => MODES.find((m) => m.key === key)!;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Өдөр тутмын давталт</Text>
      <LargeCard mode={getMode('flashcard')} onPress={() => router.push(getMode('flashcard').href as never)} />

      <Text style={styles.sectionHeading}>Ур чадвар хөгжүүлэх</Text>
      <View style={styles.row}>
        <HalfCard mode={getMode('weak')} onPress={() => router.push(getMode('weak').href as never)} />
        <HalfCard mode={getMode('writer')} onPress={() => router.push(getMode('writer').href as never)} />
      </View>
      <View style={styles.row}>
        <HalfCard mode={getMode('speak')} onPress={() => router.push(getMode('speak').href as never)} />
        <HalfCard mode={getMode('write')} onPress={() => router.push(getMode('write').href as never)} />
      </View>

      <Text style={styles.sectionHeading}>Нэмэлт ба Шалгалт</Text>
      <View style={styles.listContainer}>
        <ListRow mode={getMode('grammar')} onPress={() => router.push(getMode('grammar').href as never)} />
        <ListRow mode={getMode('mock')} onPress={() => router.push(getMode('mock').href as never)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    marginLeft: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  // Large Card
  largeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    ...shadows.sm,
  },
  largeIconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  largeBody: {
    flex: 1,
  },
  largeTitle: {
    ...typography.heading.md,
    color: colors.text.primary,
    marginBottom: 4,
  },
  largeSubtitle: {
    ...typography.body.sm,
    color: colors.text.secondary,
  },
  // Half Card
  halfCard: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderTopWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  halfIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  halfTitle: {
    ...typography.heading.sm,
    color: colors.text.primary,
    marginBottom: 2,
  },
  halfSubtitle: {
    ...typography.body.xs,
    color: colors.text.secondary,
  },
  // List Row
  listContainer: {
    backgroundColor: colors.bg.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  listBody: {
    flex: 1,
  },
  listTitle: {
    ...typography.body.md,
    fontWeight: '700',
    color: colors.text.primary,
  },
  listSubtitle: {
    ...typography.body.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
});
