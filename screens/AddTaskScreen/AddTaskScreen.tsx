import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerField } from '@/components/ui/date-picker';
import { styles } from './AddTaskScreen.style';

const FREQUENCY_OPTIONS: Array<{ value: 'daily' | 'weekly' | 'monthly'; label: string; description: string }> = [
  { value: 'daily', label: 'Codziennie', description: 'Idealne dla krótkich, powtarzalnych zadań' },
  { value: 'weekly', label: 'Co tydzień', description: 'Najlepsze do sprzątania i rotacyjnych obowiązków' },
  { value: 'monthly', label: 'Co miesiąc', description: 'Rzadziej wykonywane, większe zadania' },
];

export default function AddTaskScreen() {
  const router = useRouter();
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

    router.back();
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj zadanie"
        showBack
        onBack={() => router.back()}
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
          <Card style={styles.card}>
            <CardContent style={styles.cardContent}>
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
                  minHeight={100}
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
                        <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
                          {option.label}
                        </Text>
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

              <Button
                onPress={handleSubmit}
                disabled={!title.trim() || !dueDate}
                style={styles.submitButton}
              >
                Dodaj zadanie
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

