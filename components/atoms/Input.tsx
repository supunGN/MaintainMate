import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import React from 'react';
import {
    KeyboardTypeOptions,
    ReturnKeyTypeOptions,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  autoFocus = false,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  ...rest
}: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral.gray500}
        autoFocus={autoFocus}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="words"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: Spacing.borderRadius.lg,
    backgroundColor: Colors.neutral.gray100,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.body,
    lineHeight: Typography.lineHeight.body,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.regular,
  },
});
