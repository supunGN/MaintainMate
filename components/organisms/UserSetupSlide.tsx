import { Spacing } from '@/constants/Spacing';
import React from 'react';
import {
    Image,
    ImageSourcePropType,
    Keyboard,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    useWindowDimensions
} from 'react-native';
import Input from '../atoms/Input';
import OnboardingContent from '../molecules/OnboardingContent';

interface UserSetupSlideProps {
  illustration: ImageSourcePropType;
  title: string;
  subtitle: string;
  userName: string;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export default function UserSetupSlide({
  illustration,
  title,
  subtitle,
  userName,
  onNameChange,
  onSubmit,
}: UserSetupSlideProps) {
  const { width } = useWindowDimensions();
  
  return (
    <ScrollView 
      style={[styles.container, { width }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* TOP SECTION - Tap to dismiss keyboard */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.topSection}>
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
      </TouchableWithoutFeedback>

      {/* BOTTOM SECTION - Input (no wrapper so it receives touches) */}
      <View style={styles.inputContainer}>
        <Input
          value={userName}
          onChangeText={onNameChange}
          placeholder="Enter your name"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Prevent white flash
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF', // Prevent white flash
  },
  // TOP SECTION - Fixed content (image + text)
  topSection: {
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
  // Input at bottom
  inputContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.lg,
  },
});
