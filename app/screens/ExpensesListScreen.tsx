import { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { getUserName } from '../utils/userNames';
import { useNavigation } from 'expo-router';

const CATEGORY_STYLES: Record<
  string,
  {
    backgroundColor: string;
    color: string;
  }
> = {
  food: { backgroundColor: '#ffedd5', color: '#c2410c' },
  shopping: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  utilities: { backgroundColor: '#dcfce7', color: '#047857' },
  entertainment: { backgroundColor: '#ede9fe', color: '#6d28d9' },
  settlement: { backgroundColor: '#f3f4f6', color: '#374151' },
  other: { backgroundColor: '#fce7f3', color: '#be185d' },
};

export function ExpensesListScreen() {
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const shoppingList = useAppStore((state) => state.shoppingList);
  const tasks = useAppStore((state) => state.tasks);
  const boardPosts = useAppStore((state) => state.boardPosts);
  const calendarEvents = useAppStore((state) => state.calendarEvents);
  const navigation = useNavigation();
  const badges = useMemo(
    () => ({
      expenses: expenses.length,
      shopping: shoppingList.filter((item) => !item.purchased).length,
      tasks: tasks.filter((task) => !task.completed).length,
      calendar: calendarEvents.filter((event) => new Date(event.endDate) >= new Date()).length,
      board: boardPosts.length,
    }),
    [boardPosts.length, calendarEvents, expenses.length, shoppingList, tasks],
  );

  const balances = useMemo(() => {
    const map: Record<string, number> = {};
    currentGroup?.members.forEach((memberId) => {
      map[memberId] = 0;
    });

    expenses.forEach((expense) => {
      const split = expense.amount / expense.splitBetween.length;
      map[expense.paidBy] = (map[expense.paidBy] || 0) + expense.amount;
      expense.splitBetween.forEach((memberId) => {
        map[memberId] = (map[memberId] || 0) - split;
      });
    });

    return map;
  }, [currentGroup?.members, expenses]);

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
        onBack={() => navigation.navigate('Dashboard')}
        rightAction={
          <Button variant="ghost" style={styles.iconButton} onPress={() => navigation.navigate('AddExpense')}>
            <Ionicons name="add" size={22} color="#2563eb" />
          </Button>
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
            <Card>
              <CardContent style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Całkowite wydatki</Text>
                <Text style={styles.summaryValue}>{totalExpenses.toFixed(2)} zł</Text>
              </CardContent>
            </Card>
            <Card style={myBalance >= 0 ? styles.balancePositive : styles.balanceNegative}>
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
              onPress={() => navigation.navigate('SettleDebt')}
            >
              Rozlicz długi
            </Button>
            <Button
              variant="ghost"
              style={styles.actionButton}
              onPress={() => navigation.navigate('MonthlyReport')}
            >
              <Ionicons name="stats-chart" size={16} color="#2563eb" style={styles.actionIcon} />
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
                <Button onPress={() => navigation.navigate('AddExpense')}>Dodaj pierwszy wydatek</Button>
              </CardContent>
            </Card>
          ) : (
            sortedExpenses.map((expense) => {
              const categoryStyle = getCategoryStyle(expense.category);
              const split = expense.amount / expense.splitBetween.length;
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
                        {split.toFixed(2)} zł / os
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

      <BottomNav activeTab="expenses" onTabChange={() => navigation.navigate('Expenses')} badges={badges} />
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
    paddingBottom: 120,
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    gap: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  balancePositive: {
    backgroundColor: '#dcfce7',
  },
  balanceNegative: {
    backgroundColor: '#fee2e2',
  },
  positiveText: {
    color: '#047857',
  },
  negativeText: {
    color: '#b91c1c',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  actionIcon: {
    marginRight: 6,
  },
  sectionHeader: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emptyCard: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
  expenseCard: {
    gap: 10,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  expenseMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  expenseMetaHighlight: {
    fontWeight: '600',
    color: '#111827',
  },
  expenseDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  expenseDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
});
