import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const PRIMARY_COLOR = '#7c3aed';
const SECONDARY_COLOR = '#3b82f6';
const DISABLED_COLOR = '#d1d5db';

function getVariantStyles(variant: ButtonVariant | undefined) {
  switch (variant) {
    case 'secondary':
      return {
        container: styles.secondaryContainer,
        text: styles.secondaryText,
        indicator: '#ffffff',
      };
    case 'ghost':
      return {
        container: styles.ghostContainer,
        text: styles.ghostText,
        indicator: PRIMARY_COLOR,
      };
    case 'primary':
    default:
      return {
        container: styles.primaryContainer,
        text: styles.primaryText,
        indicator: '#ffffff',
      };
  }
}

export function Button({
  children,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const isDisabled = disabled || loading;

  const pressableStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.base,
    variantStyles.container,
    pressed && !isDisabled ? styles.pressed : null,
    isDisabled ? styles.disabled : null,
    style,
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={pressableStyle}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variantStyles.indicator} />
      ) : typeof children === 'string' ? (
        <Text style={[styles.textBase, variantStyles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
    gap: 8,
  },
  primaryContainer: {
    backgroundColor: PRIMARY_COLOR,
  },
  secondaryContainer: {
    backgroundColor: SECONDARY_COLOR,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  disabled: {
    backgroundColor: DISABLED_COLOR,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  textBase: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#ffffff',
  },
  ghostText: {
    color: PRIMARY_COLOR,
  },
});

Button.displayName = 'Button';

