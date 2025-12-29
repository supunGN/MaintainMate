import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryCardProps {
  image: ImageSourcePropType;
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryCard({ image, label, isSelected, onPress }: CategoryCardProps) {
  const handlePress = () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 140,
  },
  selected: {
    borderColor: Colors.primary.main,
    backgroundColor: '#F0FAF4',
  },
  image: {
    width: 64,
    height: 64,
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});
