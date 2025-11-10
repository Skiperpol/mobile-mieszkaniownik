import React from 'react';
import { StyleSheet, Text, TextProps, View, ViewProps } from 'react-native';

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger' | 'secondary';
  textProps?: TextProps;
}

const variants = {
  default: {
    container: {
      backgroundColor: '#e5e7eb',
    },
    text: {
      color: '#111827',
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#d1d5db',
    },
    text: {
      color: '#374151',
    },
  },
  success: {
    container: {
      backgroundColor: '#dcfce7',
    },
    text: {
      color: '#166534',
    },
  },
  secondary: {
    container: {
      backgroundColor: '#dbeafe',
    },
    text: {
      color: '#1d4ed8',
    },
  },
  warning: {
    container: {
      backgroundColor: '#fef3c7',
    },
    text: {
      color: '#92400e',
    },
  },
  danger: {
    container: {
      backgroundColor: '#fee2e2',
    },
    text: {
      color: '#b91c1c',
    },
  },
};

export function Badge({ style, children, variant = 'default', textProps, ...rest }: BadgeProps) {
  const variantStyles = variants[variant] || variants.default;
  return (
    <View style={[styles.container, variantStyles.container, style]} {...rest}>
      <Text style={[styles.text, variantStyles.text]} {...textProps}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

Badge.displayName = 'Badge';

