import React, { useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Screen } from '../../primitives';
import { useAuth } from '../../context/AuthContext';
import { mn } from '../../i18n/mn';
import { spacing } from '../../theme';
import { slides, type OnboardingSlide as Slide } from './slides';
import { OnboardingSlide as SlideView } from './OnboardingSlide';
import { Pagination } from './Pagination';

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const handleNext = async () => {
    if (current < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: current + 1, animated: true });
      return;
    }
    await completeOnboarding();
    router.replace('/(setup)');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

  const onViewable = useRef(({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
    const i = viewableItems[0]?.index;
    if (typeof i === 'number') setCurrent(i);
  }).current;

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(it) => it.id}
          renderItem={({ item }) => <SlideView slide={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        />

        <View style={styles.bottom}>
          <Pagination count={slides.length} current={current} />
          <Button
            label={current === slides.length - 1 ? mn.onboarding.start : mn.common.next}
            onPress={handleNext}
            style={{ marginBottom: spacing.sm }}
          />
          <Button label={mn.common.skip} variant="ghost" onPress={handleSkip} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  bottom: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
