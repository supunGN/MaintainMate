import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'small' | 'button';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextAlign;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
}

export default function Text({
  variant = 'body',
  color = Colors.text.primary,
  align = 'left',
  children,
  style,
  ...rest
}: TextProps) {
  const variantStyle = Typography.variants[variant];

  return (
    <RNText
      style={[
        styles.base,
        {
          fontSize: variantStyle.fontSize,
          lineHeight: variantStyle.lineHeight,
          fontWeight: variantStyle.fontWeight,
          color,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Typography.fontFamily.regular,
  },
});
