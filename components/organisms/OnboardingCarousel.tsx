import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Button from '../atoms/Button';
import OnboardingHeader from '../molecules/OnboardingHeader';
import Paginator from '../molecules/Paginator';
import OnboardingSlide from './OnboardingSlide';

export interface OnboardingSlideData {
  id: string;
  illustration: ImageSourcePropType;
  title: string;
  subtitle: string;
}

interface OnboardingCarouselProps {
  slides: OnboardingSlideData[];
  onComplete: () => void;
}

export default function OnboardingCarousel({ slides, onComplete }: OnboardingCarouselProps) {
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isLastSlide = currentIndex === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    setCurrentIndex(Math.round(offsetX / width));
  };

  const handleNext = () => {
    if (!isLastSlide) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <View style={styles.container}>
      <OnboardingHeader
        showBackButton={currentIndex > 0}
        onBackPress={handleBack}
        onSkipPress={handleSkip}
        showSkipButton={!isLastSlide}
      />

      <View style={styles.body}>
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item }) => (
            <OnboardingSlide
              illustration={item.illustration}
              title={item.title}
              subtitle={item.subtitle}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      </View>

      <View style={styles.footer}>
        <Paginator totalDots={slides.length} scrollX={scrollX} width={width} />
        <Button
          title={isLastSlide ? 'Continue' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  body: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.xl,
    backgroundColor: Colors.background.default,
  },
  button: {
    width: '100%',
  },
});
