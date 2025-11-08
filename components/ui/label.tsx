import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export interface LabelProps extends TextProps {}

export function Label({ style, children, ...rest }: LabelProps) {
  return (
    <Text style={[styles.label, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
});

Label.displayName = 'Label';

