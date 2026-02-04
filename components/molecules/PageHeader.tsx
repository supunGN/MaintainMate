import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

/**
 * PageHeader - Consistent header component for all screens
 * Includes optional back button, title, subtitle, and right action
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  showBackButton = false,
  onBackPress,
  rightAction 
}: PageHeaderProps) {
  const router = useRouter();

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress, router]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.neutral.black} />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>

        {rightAction && (
          <View style={styles.rightAction}>
            {rightAction}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8, // Align with screen edge
  },
  titleContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Typography.fontSize.h2,
    fontFamily: Typography.fontFamily.bold,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  rightAction: {
    marginLeft: 'auto',
  },
});
