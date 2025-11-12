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

export interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorMessage?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ containerStyle, inputStyle, errorMessage, ...rest }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={ref}
          style={[styles.input, inputStyle]}
          placeholderTextColor="#9ca3af"
          allowFontScaling={true}
          {...rest}
        />
        {Boolean(errorMessage) && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F3F3F5',
  },
  errorText: {
    marginTop: 6,
    color: '#dc2626',
    fontSize: 13,
  },
});

