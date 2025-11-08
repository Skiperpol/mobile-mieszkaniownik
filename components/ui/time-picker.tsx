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

function formatTimeLabel(date: Date | null, placeholder: string) {
  if (!date) {
    return placeholder;
  }

  try {
    return new Intl.DateTimeFormat('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

export interface TimePickerFieldProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

export function TimePickerField({
  value,
  onChange,
  placeholder = 'Wybierz godzinę',
  style,
  textStyle,
  accessibilityLabel,
}: TimePickerFieldProps) {
  const [iosVisible, setIosVisible] = useState(false);

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handlePress = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        mode: 'time',
        value: value ?? new Date(),
        is24Hour: true,
        onChange: handleChange,
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
          {formatTimeLabel(value, placeholder)}
        </Text>
      </Pressable>

      {Platform.OS === 'ios' && iosVisible ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="time"
          display="spinner"
          is24Hour
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              onChange(selectedDate);
            }
            setIosVisible(false);
          }}
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

