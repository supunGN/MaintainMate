import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { Search, X } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export default function SearchInput({
  placeholder = 'Search...',
  value,
  onChangeText,
  onClear,
}: SearchInputProps) {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Search
        size={20}
        color={Colors.neutral.gray500}
        style={styles.searchIcon}
      />

      {/* Text Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral.gray500}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Clear Button (visible when text exists) */}
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          activeOpacity={0.7}
        >
          <X size={18} color={Colors.neutral.gray600} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral.gray100,
    borderRadius: Spacing.borderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: Spacing.inputHeight,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.body,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.regular,
    paddingVertical: 0, // Remove default padding
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
