import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { ChevronDown, X } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

interface FilterChipProps {
  label: string;
  onPress: () => void;
  onRemove?: () => void;
  isActive?: boolean;
}

export default function FilterChip({
  label,
  onPress,
  onRemove,
  isActive = false,
}: FilterChipProps) {
  const handleRemove = (e: any) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <TouchableOpacity
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
      {isActive && onRemove ? (
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <X size={14} color={Colors.primary.main} />
        </TouchableOpacity>
      ) : (
        <ChevronDown
          size={16}
          color={isActive ? Colors.primary.main : Colors.neutral.gray600}
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.neutral.white,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderRadius: Spacing.borderRadius.full,
    gap: Spacing.xs,
  },
  chipActive: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.main + '10', // 10% opacity
  },
  label: {
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  labelActive: {
    color: Colors.primary.main,
  },
  icon: {
    marginLeft: -2,
  },
  removeButton: {
    padding: 2,
  },
});
