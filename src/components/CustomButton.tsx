import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import theme from '../theme';

type Props = {
  onPress: () => void;
  children: string;
  mode?: 'contained' | 'outlined';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function CustomButton({ 
  onPress, 
  children, 
  mode = 'contained',
  style,
  textStyle,
  disabled = false
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        mode === 'contained' ? styles.contained : styles.outlined,
        pressed && (mode === 'contained' ? styles.pressedContained : styles.pressedOutlined),
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[
        styles.text,
        mode === 'outlined' && styles.textOutlined,
        disabled && styles.textDisabled,
        textStyle
      ]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contained: {
    backgroundColor: theme.colors.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  pressedContained: {
    backgroundColor: theme.colors.primaryGradientEnd,
  },
  pressedOutlined: {
    backgroundColor: theme.colors.primary + '10',
  },
  disabled: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: 'transparent',
  },
  text: {
    fontFamily: theme.typography.button.fontFamily,
    fontSize: theme.typography.button.fontSize,
    lineHeight: theme.typography.button.lineHeight,
    letterSpacing: theme.typography.button.letterSpacing,
    textTransform: 'uppercase' as const,
    color: theme.colors.surface,
  },
  textOutlined: {
    color: theme.colors.primary,
  },
  textDisabled: {
    color: theme.colors.textTertiary,
  },
});