import { useState } from 'react';
import {
  Platform,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

function formatDateLabel(date: Date | null, placeholder: string) {
  if (!date) {
    return placeholder;
  }

  try {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}

export interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export function DatePickerField({
  value,
  onChange,
  placeholder = 'Wybierz datę',
  minimumDate,
  maximumDate,
  style,
  textStyle,
  accessibilityLabel,
}: DatePickerFieldProps) {
  const [iosVisible, setIosVisible] = useState(false);

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handlePress = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'date',
        value: value ?? new Date(),
        onChange: handleChange,
        minimumDate,
        maximumDate,
      });
    } else {
      setIosVisible(true);
    }
  };

  const pressableStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    styles.field,
    pressed ? styles.fieldPressed : null,
    style,
  ];

  return (
    <View>
      <Pressable
        onPress={handlePress}
        style={pressableStyle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <Text style={[styles.text, !value && styles.placeholder, textStyle]}>
          {formatDateLabel(value, placeholder)}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' && iosVisible ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          display="spinner"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              onChange(selectedDate);
            }
            setIosVisible(false);
          }}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          style={styles.iosPicker}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  fieldPressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  placeholder: {
    color: '#9ca3af',
    fontWeight: '400',
  },
  iosPicker: {
    marginTop: 12,
  },
});

