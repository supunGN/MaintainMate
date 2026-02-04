import { Colors } from '@/constants/Colors';
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
      bounces={false}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.topSection}>
          <View style={styles.illustrationContainer}>
            <Image
              source={illustration}
              style={[styles.illustration, {
                width: Math.min(300, width * 0.75),
                height: Math.min(300, width * 0.75),
              }]}
              resizeMode="contain"
            />
          </View>
          <OnboardingContent title={title} subtitle={subtitle} />
        </View>
      </TouchableWithoutFeedback>

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
    backgroundColor: Colors.background.default,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Spacing.xl,
  },
  illustrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    marginBottom: Spacing.screenVertical,
  },
  illustration: {
    // Dynamic sizing helper
  },
  inputContainer: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: Spacing.xl,
  },
});
