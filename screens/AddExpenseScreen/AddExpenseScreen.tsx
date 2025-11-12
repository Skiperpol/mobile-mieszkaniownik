import { useEffect, useMemo, useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getUserName } from '@/utils/userNames';
import { styles } from './AddExpenseScreen.style';

const CATEGORY_OPTIONS = [
  { value: 'food', label: 'Jedzenie' },
  { value: 'shopping', label: 'Zakupy' },
  { value: 'utilities', label: 'Rachunki' },
  { value: 'entertainment', label: 'Rozrywka' },
  { value: 'other', label: 'Inne' },
] as const;

export default function AddExpenseScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORY_OPTIONS)[number]['value']>('other');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>({});

  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const addExpense = useAppStore((state) => state.addExpense);

  const amountValue = useMemo(() => {
    const normalized = amount.replace(',', '.');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [amount]);

  // Oblicz sumę wpisanych kwot
  const totalSplitAmount = useMemo(() => {
    return Object.values(memberAmounts).reduce((sum, amountStr) => {
      const normalized = amountStr.replace(',', '.');
      const parsed = parseFloat(normalized);
      return sum + (Number.isFinite(parsed) ? parsed : 0);
    }, 0);
  }, [memberAmounts]);

  // Sprawdź, czy suma jest równa całkowitej kwocie
  const isAmountValid = useMemo(() => {
    if (selectedMembers.size === 0) return false;
    if (amountValue <= 0) return false;
    // Tolerancja 0.01 zł dla błędów zaokrągleń
    return Math.abs(totalSplitAmount - amountValue) < 0.01;
  }, [selectedMembers.size, amountValue, totalSplitAmount]);

  // Domyślne zaznaczenie wszystkich członków przy pierwszym renderze
  useEffect(() => {
    if (currentGroup && selectedMembers.size === 0 && currentGroup.members.length > 0) {
      const allMembers = new Set(currentGroup.members);
      setSelectedMembers(allMembers);
      // Ustaw domyślne wartości na 0.00
      const initialAmounts: Record<string, string> = {};
      currentGroup.members.forEach((memberId) => {
        initialAmounts[memberId] = '0.00';
      });
      setMemberAmounts(initialAmounts);
    }
  }, [currentGroup]);



  const handleMemberToggle = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
      // Usuń kwotę dla tego członka i przelicz równo dla pozostałych
      const newAmounts = { ...memberAmounts };
      delete newAmounts[memberId];
      // Przelicz równo dla pozostałych członków
      if (newSelected.size > 0 && amountValue > 0) {
        const equalAmount = (amountValue / newSelected.size).toFixed(2);
        newSelected.forEach((id) => {
          newAmounts[id] = equalAmount;
        });
      }
      setMemberAmounts(newAmounts);
      setSelectedMembers(newSelected);
    } else {
      newSelected.add(memberId);
      // Przelicz równo dla wszystkich wybranych członków
      if (newSelected.size > 0 && amountValue > 0) {
        const equalAmount = (amountValue / newSelected.size).toFixed(2);
        const newAmounts: Record<string, string> = {};
        newSelected.forEach((id) => {
          newAmounts[id] = equalAmount;
        });
        setMemberAmounts(newAmounts);
      } else {
        setMemberAmounts({ ...memberAmounts, [memberId]: '0.00' });
      }
      setSelectedMembers(newSelected);
    }
  };

  const handleMemberAmountChange = (memberId: string, value: string) => {
    // Pozwól tylko na liczby i kropkę/przecinek
    const sanitized = value.replace(/[^0-9,.-]/g, '').replace(',', '.');
    setMemberAmounts({ ...memberAmounts, [memberId]: sanitized });
  };

  const handleEqualSplit = () => {
    if (selectedMembers.size === 0 || amountValue <= 0) return;
    const equalAmount = (amountValue / selectedMembers.size).toFixed(2);
    const newAmounts: Record<string, string> = {};
    selectedMembers.forEach((memberId) => {
      newAmounts[memberId] = equalAmount;
    });
    // Usuń kwoty dla odznaczonych członków
    Object.keys(memberAmounts).forEach((memberId) => {
      if (!selectedMembers.has(memberId)) {
        delete newAmounts[memberId];
      }
    });
    setMemberAmounts(newAmounts);
  };

  const handleSubmit = () => {
    if (!currentGroup || !user || !title.trim() || amountValue <= 0 || !isAmountValid) {
      return;
    }

    // Konwertuj kwoty na liczby
    const splitAmounts: Record<string, number> = {};
    Object.entries(memberAmounts).forEach(([memberId, amountStr]) => {
      const normalized = amountStr.replace(',', '.');
      const parsed = parseFloat(normalized);
      if (Number.isFinite(parsed) && parsed > 0) {
        splitAmounts[memberId] = parsed;
      }
    });

    addExpense({
      groupId: currentGroup.id,
      title: title.trim(),
      amount: amountValue,
      paidBy: user.id,
      splitBetween: Array.from(selectedMembers),
      splitAmounts: Object.keys(splitAmounts).length > 0 ? splitAmounts : undefined,
      category,
      date: new Date(),
      description: description.trim() || undefined,
    });

    router.back();
  };

  const amountDifference = amountValue - totalSplitAmount;
  const hasDifference = Math.abs(amountDifference) >= 0.01;

  return (
    <View style={styles.root}>
      <Header
        title="Dodaj wydatek"
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
                <Label>Kwota całkowita (zł)</Label>
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
                <View style={styles.splitHeader}>
                  <Label>Podziel między</Label>
                  {selectedMembers.size > 0 && amountValue > 0 && (
                    <Pressable onPress={handleEqualSplit} style={styles.equalSplitButton}>
                      <Text style={styles.equalSplitText}>Równo</Text>
                    </Pressable>
                  )}
                </View>
                {currentGroup?.members.map((memberId) => (
                  <View key={memberId} style={styles.memberRow}>
                    <Checkbox
                      checked={selectedMembers.has(memberId)}
                      onChange={() => handleMemberToggle(memberId)}
                    />
                    <Text style={styles.memberName}>
                      {memberId === user?.id ? 'Ty' : getUserName(memberId)}
                    </Text>
                    {selectedMembers.has(memberId) && (
                      <View style={styles.amountInputWrapper}>
                        <Input
                          placeholder="0.00"
                          keyboardType="decimal-pad"
                          value={memberAmounts[memberId] || ''}
                          onChangeText={(value) => handleMemberAmountChange(memberId, value)}
                          style={styles.memberAmountInput}
                        />
                        <Text style={styles.currencyText}>zł</Text>
                      </View>
                    )}
                  </View>
                ))}
                {currentGroup && currentGroup.members.length === 0 && (
                  <Text style={styles.noMembersText}>Brak członków w grupie</Text>
                )}
              </View>

              {selectedMembers.size > 0 && (
                <View style={styles.summaryBox}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Suma kwot:</Text>
                    <Text style={[styles.summaryValue, hasDifference && styles.summaryError]}>
                      {totalSplitAmount.toFixed(2)} zł
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Kwota całkowita:</Text>
                    <Text style={styles.summaryValue}>{amountValue.toFixed(2)} zł</Text>
                  </View>
                  {hasDifference && (
                    <Text style={styles.errorText}>
                      {amountDifference > 0 
                        ? `Brakuje ${amountDifference.toFixed(2)} zł`
                        : `Nadwyżka ${Math.abs(amountDifference).toFixed(2)} zł`}
                    </Text>
                  )}
                  {!hasDifference && selectedMembers.size > 0 && (
                    <Text style={styles.successText}>✓ Suma kwot jest poprawna</Text>
                  )}
                </View>
              )}

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
                disabled={!title.trim() || amountValue <= 0 || !isAmountValid || selectedMembers.size === 0}
                style={styles.submitButton}
              >
                Dodaj wydatek
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
