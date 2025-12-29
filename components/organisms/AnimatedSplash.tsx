import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import WrenchLogo from '@/assets/images/splash-screen/wrench_logo.svg';
import { Animation } from '@/constants/Animation';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

export default function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
  // Shared values for animations
  const iconScale = useSharedValue(1);
  const iconTranslateX = useSharedValue(0);
  const iconTranslateY = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // Start animations when component mounts
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Icon animation: scale to 3x and slide down-left
    // This creates the effect where wrench grows huge and only top-right is visible
    iconScale.value = withTiming(4, {
      duration: Animation.splash.iconPulseDuration,
      easing: Easing.inOut(Easing.ease),
    });

    // Translate down (positive Y) and left (negative X)
    iconTranslateX.value = withTiming(-width * 0.1, {
      duration: Animation.splash.iconPulseDuration,
      easing: Easing.inOut(Easing.ease),
    });

    iconTranslateY.value = withTiming(height * 0.05, {
      duration: Animation.splash.iconPulseDuration,
      easing: Easing.inOut(Easing.ease),
    });

    // After icon animation, fade out the entire screen
    setTimeout(() => {
      screenOpacity.value = withTiming(
        0,
        {
          duration: Animation.splash.fadeDuration,
          easing: Easing.out(Easing.ease),
        },
        (isFinished) => {
          // Callback when animation completes
          if (isFinished) {
            runOnJS(onAnimationComplete)();
          }
        }
      );
    }, Animation.splash.iconPulseDuration + 900);
  };

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { translateX: iconTranslateX.value },
      { translateY: iconTranslateY.value },
    ],
  }));

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, screenAnimatedStyle]}>
      <LinearGradient
        colors={[Colors.splash.gradientStart, Colors.splash.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <WrenchLogo width={150} height={150} />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
