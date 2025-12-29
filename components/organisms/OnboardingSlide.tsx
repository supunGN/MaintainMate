import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View, useWindowDimensions } from 'react-native';
import OnboardingContent from '../molecules/OnboardingContent';

interface OnboardingSlideProps {
  illustration: ImageSourcePropType;
  title: string;
  subtitle: string;
}

export default function OnboardingSlide({
  illustration,
  title,
  subtitle,
}: OnboardingSlideProps) {
  const { width } = useWindowDimensions();
  
  return (
    <View style={[styles.container, { width }]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image source={illustration} style={[styles.illustration, {
          width: Math.min(300, width * 0.75),
          height: Math.min(300, width * 0.75),
        }]} resizeMode="contain" />
      </View>

      {/* Title and Subtitle */}
      <OnboardingContent title={title} subtitle={subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.screenVertical,
  },
  illustration: {
    // Dynamic sizing in inline style
  },
});
