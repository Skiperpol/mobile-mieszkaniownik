import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

export interface CardProps extends ViewProps {
  elevation?: number;
}

export function Card({ style, elevation = 2, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, shadow(elevation), style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardContentProps extends ViewProps {
  inset?: boolean;
}

export function CardContent({ style, inset, children, ...rest }: CardContentProps) {
  return (
    <View style={[styles.content, inset ? styles.inset : null, style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardHeaderProps extends ViewProps {}

export function CardHeader({ style, children, ...rest }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]} {...rest}>
      {children}
    </View>
  );
}

export interface CardTitleProps extends TextProps {}

export function CardTitle({ style, children, ...rest }: CardTitleProps) {
  return (
    <Text style={[styles.title, style]} {...rest}>
      {children}
    </Text>
  );
}

export interface CardDescriptionProps extends TextProps {}

export function CardDescription({ style, children, ...rest }: CardDescriptionProps) {
  return (
    <Text style={[styles.description, style]} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  inset: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
});

const shadow = (level: number): StyleProp<ViewStyle> => ({
  shadowColor: '#1f2937',
  shadowOffset: {
    width: 0,
    height: Math.max(1, level),
  },
  shadowOpacity: 0.1 + level * 0.02,
  shadowRadius: 4 + level * 1.2,
  elevation: 1 + level,
});

