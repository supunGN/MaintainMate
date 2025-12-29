import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef } from 'react';
import {
  Dimensions,
  FlatList,
  ImageSourcePropType,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Button from '../atoms/Button';
import OnboardingHeader from '../molecules/OnboardingHeader';
import Paginator from '../molecules/Paginator';
import OnboardingSlide from './OnboardingSlide';
import UserSetupSlide from './UserSetupSlide';

const { width, height } = Dimensions.get('window');

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
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [userName, setUserName] = React.useState('');

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    scrollX.value = offsetX;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Save user name to AsyncStorage before completing
      try {
        await AsyncStorage.setItem('@user_name', userName.trim());
      } catch (error) {
        console.error('Error saving user name:', error);
      }
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
    // Navigate to User Setup slide (last slide) instead of completing
    flatListRef.current?.scrollToIndex({
      index: slides.length - 1,
      animated: true,
    });
  };

  const handleNameChange = (name: string) => {
    setUserName(name);
  };

  const handleNameSubmit = () => {
    if (userName.trim().length >= 2) {
      handleNext();
    }
  };

  // Check if button should be disabled
  const isButtonDisabled = currentIndex === slides.length - 1 && userName.trim().length < 2;

  return (
    <View style={styles.container}>
      {/* KeyboardAvoidingView wraps only header + body, NOT footer */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={16} // 16px gap between keyboard and input
      >
        {/* ZONE 1: Top Header - Fixed Height */}
        <View style={styles.header}>
          <OnboardingHeader
            showBackButton={currentIndex > 0}
            onBackPress={handleBack}
            onSkipPress={handleSkip}
            showSkipButton={currentIndex < slides.length - 1}
          />
        </View>

        {/* ZONE 2: Middle Body - Flexible, Scrollable */}
        <View style={styles.body}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={({ item, index }) => {
              // Render UserSetupSlide for the last slide
              if (index === slides.length - 1) {
                return (
                  <UserSetupSlide
                    illustration={item.illustration}
                    title={item.title}
                    subtitle={item.subtitle}
                    userName={userName}
                    onNameChange={handleNameChange}
                    onSubmit={handleNameSubmit}
                  />
                );
              }
              // Regular slides
              return (
                <OnboardingSlide
                  illustration={item.illustration}
                  title={item.title}
                  subtitle={item.subtitle}
                />
              );
            }}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={false}
          />
        </View>
      </KeyboardAvoidingView>

      {/* ZONE 3: Bottom Footer - OUTSIDE KeyboardAvoidingView, stays fixed */}
      <View style={styles.footer}>
        <Paginator totalDots={slides.length} scrollX={scrollX} width={width} />
        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          disabled={isButtonDisabled}
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
  keyboardView: {
    flex: 1,
  },
  // ZONE 1: Fixed Header
  header: {
    justifyContent: 'center',
  },
  // ZONE 2: Flexible Body
  body: {
    flex: 1, // Takes remaining space
  },
  // ZONE 3: Fixed Footer
  footer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingBottom: Math.max(20, height * 0.05),
    paddingTop: Spacing.md,
    gap: Spacing.xl,
    backgroundColor: Colors.background.default,
  },
  button: {
    width: '100%',
  },
});
