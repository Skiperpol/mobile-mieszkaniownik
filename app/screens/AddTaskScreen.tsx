import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { DatePickerField } from '../components/ui/date-picker';

const FREQUENCY_OPTIONS: Array<{ value: 'daily' | 'weekly' | 'monthly'; label: string; description: string }> = [
  { value: 'daily', label: 'Codziennie', description: 'Idealne dla krótkich, powtarzalnych zadań' },
  { value: 'weekly', label: 'Co tydzień', description: 'Najlepsze do sprzątania i rotacyjnych obowiązków' },
  { value: 'monthly', label: 'Co miesiąc', description: 'Rzadziej wykonywane, większe zadania' },
];

interface AddTaskScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function AddTaskScreen({ onNavigate, onBack }: AddTaskScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const currentGroup = useAppStore((state) => state.currentGroup);
  const addTask = useAppStore((state) => state.addTask);

  const firstMember = useMemo(() => currentGroup?.members[0], [currentGroup?.members]);

  const handleSubmit = () => {
    if (!currentGroup || !firstMember || !title.trim() || !dueDate) {
      return;
    }

    addTask({
      groupId: currentGroup.id,
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo: firstMember,
      frequency,
      completed: false,
      dueDate,
      rotationOrder: currentGroup.members,
    });

    onNavigate('tasks');
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj zadanie"
        showBack
        onBack={onBack || (() => onNavigate('tasks'))}
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
              <Label>Nazwa zadania</Label>
              <Input
                placeholder="np. Odkurzyć salon"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Label>Opis (opcjonalnie)</Label>
              <Textarea
                placeholder="Dodatkowe informacje o zadaniu..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.field}>
              <Label>Częstotliwość</Label>
              <View style={styles.optionList}>
                {FREQUENCY_OPTIONS.map((option) => {
                  const selected = option.value === frequency;
                  return (
                    <Pressable
                      key={option.value}
                      style={({ pressed }) => [
                        styles.optionCard,
                        selected && styles.optionCardSelected,
                        pressed && styles.optionCardPressed,
                      ]}
                      onPress={() => setFrequency(option.value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>{option.label}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Label>Pierwszy termin</Label>
              <DatePickerField
                value={dueDate}
                onChange={setDueDate}
                placeholder="Wybierz datę"
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Zadanie będzie rotowane automatycznie między wszystkimi członkami grupy ({currentGroup?.members.length || 0}{' '}
                osób)
              </Text>
            </View>

            <Button onPress={handleSubmit} disabled={!title.trim() || !dueDate}>
              Dodaj zadanie
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
  },
  optionList: {
    gap: 12,
  },
  optionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  optionCardSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  optionCardPressed: {
    opacity: 0.9,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  optionTitleSelected: {
    color: '#047857',
  },
  optionDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    fontSize: 13,
    color: '#1f2937',
  },
});