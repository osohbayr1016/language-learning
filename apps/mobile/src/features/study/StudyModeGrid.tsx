import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../theme';
import { mn } from '../../i18n/mn';
import { StudyModeCard } from './StudyModeCard';

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
];

export function StudyModeGrid() {
  const router = useRouter();
  return (
    <View style={styles.grid}>
      {MODES.map((m) => (
        <StudyModeCard
          key={m.key}
          title={m.title}
          subtitle={m.subtitle}
          icon={m.icon}
          color={m.color}
          onPress={() => router.push(m.href as never)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
});
