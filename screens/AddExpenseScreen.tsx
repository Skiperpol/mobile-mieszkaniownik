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

const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Jedzenie' },
  { value: 'shopping', label: 'Zakupy' },
  { value: 'utilities', label: 'Rachunki' },
  { value: 'entertainment', label: 'Rozrywka' },
  { value: 'other', label: 'Inne' },
] as const;

interface AddExpenseScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function AddExpenseScreen({ onNavigate, onBack }: AddExpenseScreenProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]['value']>('other');
  const [description, setDescription] = useState('');

  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const addExpense = useAppStore((state) => state.addExpense);

  const amountValue = useMemo(() => {
    const normalized = amount.replace(',', '.');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  const perPersonShare = useMemo(() => {
    const members = currentGroup?.members.length || 1;
    return members > 0 && amountValue > 0 ? (amountValue / members).toFixed(2) : null;
  }, [amountValue, currentGroup?.members.length]);

  const handleSubmit = () => {
    if (!currentGroup || !user || !title.trim() || amountValue <= 0) {
      return;
    }

    addExpense({
      groupId: currentGroup.id,
      title: title.trim(),
      amount: amountValue,
      paidBy: user.id,
      splitBetween: currentGroup.members,
      category,
      date: new Date(),
      description: description.trim() || undefined,
    });

    onNavigate('expenses');
  };

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj wydatek"
        showBack
        onBack={onBack || (() => onNavigate('expenses'))}
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
              <Label>Tytuł wydatku</Label>
              <Input
                placeholder="np. Zakupy spożywcze"
                value={title}
                onChangeText={setTitle}
                autoCapitalize="sentences"
                returnKeyType="next"
              />
            </View>

            <View style={styles.field}>
              <Label>Kwota (zł)</Label>
              <Input
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                returnKeyType="done"
              />
            </View>

            <View style={styles.field}>
              <Label>Kategoria</Label>
              <View style={styles.chipGroup}>
                {CATEGORY_OPTIONS.map((option) => {
                  const selected = category === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setCategory(option.value)}
                      style={({ pressed }) => [
                        styles.chip,
                        selected && styles.chipSelected,
                        pressed && styles.chipPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
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

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Wydatek zostanie podzielony równo między wszystkich członków grupy ({currentGroup?.members.length || 0}{' '}
                osób)
              </Text>
              {perPersonShare ? (
                <Text style={styles.infoText}>
                  Po {perPersonShare} zł na osobę
                </Text>
              ) : null}
            </View>

            <Button onPress={handleSubmit} disabled={!title.trim() || amountValue <= 0}>
              Dodaj wydatek
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
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  chipSelected: {
    backgroundColor: '#ede9fe',
    borderColor: '#8b5cf6',
  },
  chipPressed: {
    opacity: 0.85,
  },
  chipText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#5b21b6',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#1f2937',
  },
});