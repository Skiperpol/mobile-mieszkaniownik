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

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
    case 'outline':
      return {
        container: styles.outlineContainer,
        text: styles.outlineText,
        indicator: PRIMARY_COLOR,
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
  size = 'md',
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const isDisabled = disabled || loading;
  const sizeStyles = getSizeStyles(size);

  const pressableStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.base,
    variantStyles.container,
    sizeStyles.container,
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
        <Text style={[styles.textBase, sizeStyles.text, variantStyles.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function getSizeStyles(size: ButtonSize) {
  switch (size) {
    case 'sm':
      return {
        container: styles.sizeSm,
        text: styles.textSm,
      };
    case 'lg':
      return {
        container: styles.sizeLg,
        text: styles.textLg,
      };
    case 'md':
    default:
      return {
        container: styles.sizeMd,
        text: styles.textMd,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
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
  outlineContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c4b5fd',
  },
  disabled: {
    backgroundColor: DISABLED_COLOR,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  textBase: {
    fontWeight: '600',
  },
  textMd: {
    fontSize: 16,
  },
  textSm: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 18,
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
  outlineText: {
    color: PRIMARY_COLOR,
  },
  sizeSm: {
    height: 40,
    paddingHorizontal: 14,
  },
  sizeMd: {
    height: 48,
  },
  sizeLg: {
    height: 56,
    paddingHorizontal: 20,
  },
});

Button.displayName = 'Button';

