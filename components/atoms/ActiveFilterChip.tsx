import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { X } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ActiveFilterChipProps {
  label: string;
  onRemove: () => void;
}

export default function ActiveFilterChip({
  label,
  onRemove,
}: ActiveFilterChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={onRemove}
        style={styles.closeButton}
        activeOpacity={0.7}
      >
        <X size={14} color={Colors.primary.main} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
    paddingRight: Spacing.xs,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary.main + '15', // 15% opacity
    borderWidth: 1,
    borderColor: Colors.primary.main,
    borderRadius: Spacing.borderRadius.full,
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.caption,
    fontFamily: Typography.fontFamily.medium,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.main,
  },
  closeButton: {
    padding: 2,
  },
});
