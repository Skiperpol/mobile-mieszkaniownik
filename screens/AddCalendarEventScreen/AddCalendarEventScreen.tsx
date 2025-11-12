import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerField } from '@/components/ui/date-picker';
import { styles } from './AddCalendarEventScreen.style';

const TYPES: Array<{ value: 'absence' | 'event'; label: string; description: string }> = [
  { value: 'absence', label: 'Nieobecność', description: 'Informacja o Twojej nieobecności w mieszkaniu' },
  { value: 'event', label: 'Wydarzenie', description: 'Wspólne wydarzenie lub ważna informacja dla mieszkańców' },
];

export default function AddCalendarEventScreen() {
  const router = useRouter();
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

    router.back();
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj wpis do kalendarza"
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
                        <Text style={[styles.typeTitle, selected && styles.typeTitleSelected]}>
                          {option.label}
                        </Text>
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
                <View style={styles.dateField}>
                  <Label>Data od</Label>
                  <DatePickerField
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Wybierz datę"
                    maximumDate={endDate ?? undefined}
                  />
                </View>
                <View style={styles.dateField}>
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
                  minHeight={100}
                />
              </View>

              <Button
                onPress={handleSubmit}
                disabled={!title.trim() || !startDate || !endDate}
                style={styles.submitButton}
              >
                Dodaj do kalendarza
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

