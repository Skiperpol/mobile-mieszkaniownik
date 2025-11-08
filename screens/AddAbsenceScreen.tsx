import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Header } from '../components/Header';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DatePickerField } from '../components/ui/date-picker';

interface AddAbsenceScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

const TYPES: Array<{ value: 'absence' | 'event'; label: string; description: string }> = [
  { value: 'absence', label: 'Nieobecność', description: 'Informacja o Twojej nieobecności w mieszkaniu' },
  { value: 'event', label: 'Wydarzenie', description: 'Wspólne wydarzenie lub ważna informacja dla mieszkańców' },
];

export function AddAbsenceScreen({ onNavigate, onBack }: AddAbsenceScreenProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'absence' | 'event'>('absence');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');

  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const addCalendarEvent = useAppStore((state) => state.addCalendarEvent);

  const handleSubmit = () => {
    if (!currentGroup || !user || !title.trim() || !startDate || !endDate) {
      return;
    }

    addCalendarEvent({
      groupId: currentGroup.id,
      title: title.trim(),
      type,
      userId: user.id,
      startDate,
      endDate,
      description: description.trim() || undefined,
    });

    onNavigate('calendar');
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj wpis do kalendarza"
        showBack
        onBack={onBack || (() => onNavigate('calendar'))}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.field}>
              <Label>Typ</Label>
              <View style={styles.typeList}>
                {TYPES.map((option) => {
                  const selected = option.value === type;
                  return (
                    <Pressable
                      key={option.value}
                      style={({ pressed }) => [
                        styles.typeCard,
                        selected && styles.typeCardSelected,
                        pressed && styles.typeCardPressed,
                      ]}
                      onPress={() => setType(option.value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.typeTitle, selected && styles.typeTitleSelected]}>{option.label}</Text>
                      <Text style={styles.typeDescription}>{option.description}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Label>Tytuł</Label>
              <Input
                placeholder={type === 'absence' ? 'np. Wyjazd do rodziny' : 'np. Impreza urodzinowa'}
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={styles.datesRow}>
              <View style={styles.field}>
                <Label>Data od</Label>
                <DatePickerField
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Wybierz datę"
                  maximumDate={endDate ?? undefined}
                />
              </View>
              <View style={styles.field}>
                <Label>Data do</Label>
                <DatePickerField
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="Wybierz datę"
                  minimumDate={startDate ?? undefined}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Label>Opis (opcjonalnie)</Label>
              <Textarea
                placeholder="Dodatkowe informacje..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <Button onPress={handleSubmit} disabled={!title.trim() || !startDate || !endDate}>
              Dodaj do kalendarza
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    gap: 20,
  },
  field: {
    gap: 8,
    flex: 1,
  },
  typeList: {
    gap: 12,
  },
  typeCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  typeCardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  typeCardPressed: {
    opacity: 0.9,
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  typeTitleSelected: {
    color: '#5b21b6',
  },
  typeDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 16,
  },
});
