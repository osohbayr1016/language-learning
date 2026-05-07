import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../primitives';
import { colors, spacing, typography } from '../../theme';
import { mn } from '../../i18n/mn';
import { StudyModeTile } from './StudyModeTile';
import { DueWordsList } from './DueWordsList';

const MODES: {
  key: string;
  title: string;
  subtitle: string;
  icon: 'albums-outline' | 'school-outline' | 'create-outline' | 'brush-outline';
  color: string;
  href: string;
}[] = [
  { key: 'flashcard', title: mn.study.flashcard, subtitle: 'Карт эргүүлэн цээжлэх', icon: 'albums-outline', color: colors.accent.purple, href: '/study/flashcard' },
  { key: 'learn', title: mn.study.learn, subtitle: 'Сонголтоор сурах', icon: 'school-outline', color: colors.accent.blue, href: '/study/learn' },
  { key: 'write', title: mn.study.write, subtitle: 'Pinyin бичих', icon: 'create-outline', color: colors.accent.teal, href: '/study/write' },
  { key: 'writer', title: mn.study.writer, subtitle: 'Ханз зурах', icon: 'brush-outline', color: colors.accent.pink, href: '/study/writer' },
];

export default function StudyHubScreen() {
  const router = useRouter();

  return (
    <Screen scroll>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>{mn.tabs.study}</Text>
        <Text style={styles.subheading}>Өнөөдөр ямар горимоор сурах вэ?</Text>
      </View>
      {MODES.map((m) => (
        <StudyModeTile
          key={m.key}
          title={m.title}
          subtitle={m.subtitle}
          icon={m.icon}
          color={m.color}
          onPress={() => router.push(m.href as never)}
        />
      ))}
      <DueWordsList limit={5} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { marginBottom: spacing.lg, marginTop: spacing.sm },
  heading: { ...typography.heading.xl, color: colors.text.primary },
  subheading: { ...typography.body.md, color: colors.text.secondary, marginTop: 4 },
});
