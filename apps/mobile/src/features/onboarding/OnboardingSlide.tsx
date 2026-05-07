import React from 'react';
import { Image, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import type { OnboardingSlide as Slide } from './slides';

type Props = { slide: Slide };

export function OnboardingSlide({ slide }: Props) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.imageWrap}>
        <Image source={slide.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.text}>
        <Text style={styles.hanzi}>{slide.hanzi}</Text>
        <Text style={styles.pinyin}>{slide.pinyin}</Text>
        <Text style={styles.title}>{slide.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, alignItems: 'center', paddingTop: spacing.xxl },
  imageWrap: {
    width: '85%',
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  text: { alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  hanzi: {
    ...typography.hanzi.md,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  pinyin: {
    ...typography.pinyin.md,
    color: colors.accent.purple,
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  title: {
    ...typography.heading.lg,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 32,
  },
});
