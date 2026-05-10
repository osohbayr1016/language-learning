import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { OnboardingSlide as SlideView } from './OnboardingSlide';
import type { OnboardingStrings } from './onboardingCopy';
import type { OnboardingSlide as SlideType } from './slides';

export type OnboardingCarouselHandle = { scrollTo: (index: number) => void };

type Props = {
  width: number;
  slides: SlideType[];
  strings: OnboardingStrings;
  onIndexChange: (index: number) => void;
};

export const OnboardingCarousel = forwardRef<OnboardingCarouselHandle, Props>(
  function OnboardingCarousel({ width, slides, strings, onIndexChange }, ref) {
    const scrollRef = useRef<ScrollView>(null);

    useImperativeHandle(ref, () => ({
      scrollTo: (index: number) => {
        scrollRef.current?.scrollTo({ x: index * width, animated: true });
      },
    }));

    const onMomentumEnd = useCallback(
      (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        if (width <= 0) return;
        onIndexChange(Math.min(slides.length - 1, Math.max(0, Math.round(x / width))));
      },
      [width, slides.length, onIndexChange],
    );

    if (width <= 0) return null;

    return (
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onMomentumScrollEnd={onMomentumEnd}
        onScrollEndDrag={onMomentumEnd}
        style={styles.scroll}
        contentContainerStyle={styles.content}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width }}>
            <SlideView slide={slide} strings={strings} />
          </View>
        ))}
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scroll: { flex: 1, width: '100%' },
  content: { flexDirection: 'row', alignItems: 'stretch' },
});
