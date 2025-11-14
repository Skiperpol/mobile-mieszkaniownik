import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAppStore } from '@/hooks/useAppStore';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getUserName } from '@/utils/userNames';
import { calculateMemberBalances } from '@/utils/expenses';
import { styles } from './ExpensesListScreen.style';

const CATEGORY_STYLES: Record<
  string,
  {
    backgroundColor: string;
    color: string;
  }
> = {
  food: { backgroundColor: '#ffedd5', color: '#c2410c' },
  shopping: { backgroundColor: '#dbeafe', color: '#155DFC' },
  utilities: { backgroundColor: '#dcfce7', color: '#047857' },
  entertainment: { backgroundColor: '#ede9fe', color: '#6d28d9' },
  settlement: { backgroundColor: '#f3f4f6', color: '#374151' },
  other: { backgroundColor: '#fce7f3', color: '#be185d' },
};

export default function ExpensesListScreen() {
  const router = useRouter();
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);

  const balances = useMemo(
    () => calculateMemberBalances(expenses, currentGroup?.members || []),
    [currentGroup?.members, expenses],
  );

  const totalExpenses = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses],
  );

  const myBalance = balances[user?.id || ''] || 0;

  const sortedExpenses = useMemo(
    () =>
      [...expenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [expenses],
  );

  const getCategoryStyle = (category: string) => CATEGORY_STYLES[category] || CATEGORY_STYLES.other;


  return (
    <View style={styles.root}>
      <Header
        title="Skarbonka"
        showBack
        onBack={() => router.back()}
        rightAction={
          <Pressable onPress={() => router.push('/(group)/add-expense')} style={styles.headerAction} hitSlop={10}>
            <Ionicons name="add" size={22} color="#155DFC" />
          </Pressable>
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCardWrapper}>
              <CardContent style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Całkowite wydatki</Text>
                <Text style={styles.summaryValue}>{totalExpenses.toFixed(2)} zł</Text>
              </CardContent>
            </Card>
            <Card style={[styles.summaryCardWrapper, myBalance >= 0 ? styles.balancePositive : styles.balanceNegative]}>
              <CardContent style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Twoje saldo</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    myBalance >= 0 ? styles.positiveText : styles.negativeText,
                  ]}
                >
                  {myBalance >= 0 ? '+' : ''}
                  {myBalance.toFixed(2)} zł
                </Text>
              </CardContent>
            </Card>
          </View>

          <View style={styles.actionsRow}>
            <Button
              variant="ghost"
              style={styles.actionButton}
              onPress={() => router.push('/(group)/settle-debt')}
            >
              Rozlicz długi
            </Button>
            <Button
              variant="ghost"
              style={styles.actionButton}
              onPress={() => router.push('/(group)/monthly-report')}
            >
              Raport
            </Button>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ostatnie wydatki</Text>
          </View>

          {sortedExpenses.length === 0 ? (
            <Card>
              <CardContent style={styles.emptyCard}>
                <Text style={styles.emptyText}>Brak wydatków</Text>
                <Button onPress={() => router.push('/(group)/add-expense')}>Dodaj pierwszy wydatek</Button>
              </CardContent>
            </Card>
          ) : (
            sortedExpenses.map((expense) => {
              const categoryStyle = getCategoryStyle(expense.category);
              // Oblicz średnią kwotę na osobę
              const averagePerPerson = expense.splitAmounts && Object.keys(expense.splitAmounts).length > 0
                ? Object.values(expense.splitAmounts).reduce((sum, amt) => sum + amt, 0) / Object.keys(expense.splitAmounts).length
                : expense.amount / expense.splitBetween.length;
              return (
                <Card key={expense.id}>
                  <CardContent style={styles.expenseCard}>
                    <View style={[styles.categoryPill, categoryStyle]}>
                      <Text style={[styles.categoryText, { color: categoryStyle.color }]}>
                        {expense.category}
                      </Text>
                    </View>

                    <View style={styles.expenseHeader}>
                      <Text style={styles.expenseTitle}>{expense.title}</Text>
                      <Text style={styles.expenseAmount}>{expense.amount.toFixed(2)} zł</Text>
                    </View>

                    <View style={styles.expenseMetaRow}>
                      <Text style={styles.expenseMeta}>
                        Zapłacił:{' '}
                        <Text style={styles.expenseMetaHighlight}>
                          {expense.paidBy === user?.id ? 'Ty' : getUserName(expense.paidBy)}
                        </Text>
                      </Text>
                      <Text style={styles.expenseMeta}>
                        {expense.splitAmounts && Object.keys(expense.splitAmounts).length > 0
                          ? `${expense.splitBetween.length} osób (niestandardowy podział)`
                          : `${averagePerPerson.toFixed(2)} zł / os`}
                      </Text>
                    </View>

                    <Text style={styles.expenseDate}>
                      {new Date(expense.date).toLocaleDateString('pl-PL')}
                    </Text>

                    {expense.description ? (
                      <Text style={styles.expenseDescription}>{expense.description}</Text>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* <BottomNav activeTab="expenses" onTabChange={handleTabChange} /> */}
    </View>
  );
}

