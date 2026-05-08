import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, ViewStyle } from "react-native";
import { colors, radius, shadows, spacing } from "../../../theme";

type Props = {
  flipped: boolean;
  onPress: () => void;
  front: React.ReactNode;
  back: React.ReactNode;
  style?: ViewStyle;
};

export function FlipCard({ flipped, onPress, front, back, style }: Props) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: flipped ? 180 : 0,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [flipped, rotation]);

  const frontRotate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = rotation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });
  const frontOpacity = rotation.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = rotation.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  return (
    <Pressable onPress={onPress} style={[styles.wrap, style]}>
      <Animated.View
        style={[
          styles.face,
          {
            transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
            opacity: frontOpacity,
          },
        ]}
      >
        {front}
      </Animated.View>
      <Animated.View
        style={[
          styles.face,
          styles.absolute,
          {
            transform: [{ perspective: 1000 }, { rotateY: backRotate }],
            opacity: backOpacity,
          },
        ]}
      >
        {back}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 300,
    backgroundColor: "transparent",
  },
  face: {
    flex: 1,
    backgroundColor: colors.bg.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    ...shadows.md,
  },
  absolute: { ...StyleSheet.absoluteFillObject },
});
