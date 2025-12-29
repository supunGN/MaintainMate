import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../atoms/Text';

interface OnboardingContentProps {
  title: string;
  subtitle: string;
}

export default function OnboardingContent({ title, subtitle }: OnboardingContentProps) {
  return (
    <View style={styles.container}>
      <Text variant="h2" color={Colors.text.primary} align="center">
        {title}
      </Text>
      <Text
        variant="body"
        color={Colors.text.secondary}
        align="center"
        style={styles.subtitle}
      >
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
});
