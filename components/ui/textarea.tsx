import React, { forwardRef } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

export interface TextareaProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorMessage?: string;
  minHeight?: number;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  ({ containerStyle, inputStyle, errorMessage, minHeight = 120, multiline = true, ...rest }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={ref}
          multiline={multiline}
          textAlignVertical="top"
          style={[styles.input, { minHeight }, inputStyle]}
          placeholderTextColor="#9ca3af"
          {...rest}
        />
        {Boolean(errorMessage) && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    );
  }
);

Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  errorText: {
    marginTop: 6,
    color: '#dc2626',
    fontSize: 13,
  },
});

