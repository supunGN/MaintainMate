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
  style?: object;
}

const Input = React.forwardRef<TextInput, InputProps>((
  {
    value,
    onChangeText,
    placeholder,
    autoFocus = false,
    keyboardType = 'default',
    returnKeyType = 'done',
    onSubmitEditing,
    style,
    ...rest
  },
  ref
) => {
  return (
    <View style={styles.container}>
      <TextInput
        ref={ref}
        style={[styles.input, style]}
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
});

Input.displayName = 'Input';

export default Input;

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
