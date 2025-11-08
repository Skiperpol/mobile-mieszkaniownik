import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked = false, onChange, disabled }: CheckboxProps) {
  const handlePress = useCallback(() => {
    if (disabled) return;
    onChange?.(!checked);
  }, [checked, disabled, onChange]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
      ]}
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View style={[styles.box, checked ? styles.boxChecked : null]}>
        {checked && <Ionicons name="checkmark" size={18} color="#ffffff" />}
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  boxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});

