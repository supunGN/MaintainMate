import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface PaginatorProps {
  totalDots: number;
  scrollX: SharedValue<number>;
  width: number;
}

export default function Paginator({ totalDots, scrollX, width }: PaginatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalDots }).map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotStyle = useAnimatedStyle(() => {
          const isActive = Math.round(scrollX.value / width) === index;
          
          // Active dot: pill shape (20px wide, 10px tall)
          // Inactive dot: circle (8px)
          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            isActive ? [8, 20, 8] : [8, 8, 8],
            Extrapolate.CLAMP
          );

          const dotHeight = interpolate(
            scrollX.value,
            inputRange,
            [8, 10, 8],
            Extrapolate.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolate.CLAMP
          );

          return {
            width: dotWidth,
            height: dotHeight,
            opacity,
            backgroundColor: isActive
              ? Colors.onboarding.activeDot
              : Colors.onboarding.inactiveDot,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.dot, dotStyle]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    borderRadius: 5,
  },
});
