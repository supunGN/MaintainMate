import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import IconButton from '../atoms/IconButton';
import Text from '../atoms/Text';

interface OnboardingHeaderProps {
  showBackButton: boolean;
  onBackPress: () => void;
  onSkipPress: () => void;
  showSkipButton?: boolean;
}

export default function OnboardingHeader({
  showBackButton,
  onBackPress,
  onSkipPress,
  showSkipButton = true,
}: OnboardingHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left Side - Back Button */}
      <View style={styles.leftContainer}>
        {showBackButton && (
          <IconButton
            icon="chevron-back"
            onPress={onBackPress}
            size={20}
            color={Colors.text.primary}
            backgroundColor={Colors.neutral.gray200}
          />
        )}
      </View>

      {/* Right Side - Skip Button */}
      {showSkipButton && (
        <TouchableOpacity onPress={onSkipPress} activeOpacity={0.7}>
          <Text variant="caption" color={Colors.onboarding.skipText}>
            Skip
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
  },
  leftContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
});
