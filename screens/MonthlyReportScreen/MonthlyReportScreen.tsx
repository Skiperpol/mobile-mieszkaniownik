import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { styles } from './MonthlyReportScreen.style';

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  food: { label: 'Jedzenie', color: '#f97316' },
  shopping: { label: 'Zakupy', color: '#2563eb' },
  utilities: { label: 'Rachunki', color: '#16a34a' },
  entertainment: { label: 'Rozrywka', color: '#8b5cf6' },
  settlement: { label: 'Rozliczenia', color: '#4b5563' },
  other: { label: 'Inne', color: '#ec4899' },
};

export default function MonthlyReportScreen() {
  const router = useRouter();
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);

  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getFullYear() === now.getFullYear() &&
      expenseDate.getMonth() === now.getMonth()
    );
  });

  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getFullYear() === previousMonth.getFullYear() &&
      expenseDate.getMonth() === previousMonth.getMonth()
    );
  });

  const currentTotal = useMemo(
    () => currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [currentMonthExpenses],
  );
  const previousTotal = useMemo(
    () => previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [previousMonthExpenses],
  );
  const difference = currentTotal - previousTotal;
  const percentChange = previousTotal > 0 ? (difference / previousTotal) * 100 : 0;
  const averagePerMember = currentTotal / Math.max(currentGroup?.members.length ?? 1, 1);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    currentMonthExpenses.forEach((expense) => {
      totals[expense.category] = (totals[expense.category] ?? 0) + expense.amount;
    });
    return Object.entries(totals)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .map(([category, amount]) => ({ category, amount }));
  }, [currentMonthExpenses]);

  const renderSummaryCard = (
    icon: React.ReactNode,
    label: string,
    value: string,
    accentColor?: string,
  ) => (
    <Card style={[styles.card, styles.summaryCard]}>
      <CardContent style={styles.cardContent}>
        <View style={styles.summaryHeader}>
          <View style={[styles.summaryIconWrapper, accentColor ? { backgroundColor: accentColor } : null]}>
            {icon}
          </View>
          <Text style={styles.summaryLabel}>{label}</Text>
        </View>
        <Text style={styles.summaryValue}>{value}</Text>
      </CardContent>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header title="Raport miesięczny" showBack onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          {renderSummaryCard(
            <Ionicons name="cash-outline" size={18} color="#1f2937" />,
            'Obecny miesiąc',
            `${currentTotal.toFixed(2)} zł`,
            '#e0f2fe',
          )}
          {renderSummaryCard(
            <Ionicons
              name={difference >= 0 ? 'trending-up-outline' : 'trending-down-outline'}
              size={18}
              color={difference >= 0 ? '#b91c1c' : '#15803d'}
            />,
            'Zmiana',
            `${difference >= 0 ? '+' : ''}${percentChange.toFixed(0)}%`,
            difference >= 0 ? '#fee2e2' : '#dcfce7',
          )}
        </View>

        <Card style={styles.card}>
          <CardContent style={styles.cardContent}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Poprzedni miesiąc</Text>
              <Text style={styles.statValue}>{previousTotal.toFixed(2)} zł</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Liczba wydatków</Text>
              <Text style={styles.statValue}>{currentMonthExpenses.length}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Średnia na osobę</Text>
              <Text style={styles.statValue}>{averagePerMember.toFixed(2)} zł</Text>
            </View>
          </CardContent>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wydatki według kategorii</Text>

          {categoryTotals.length === 0 ? (
            <Card style={styles.card}>
              <CardContent style={[styles.cardContent, styles.centerContent]}>
                <Ionicons name="pie-chart-outline" size={48} color="#9ca3af" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>Brak wydatków w tym miesiącu</Text>
              </CardContent>
            </Card>
          ) : (
            categoryTotals.map(({ category, amount }) => {
              const meta = CATEGORY_META[category] ?? CATEGORY_META.other;
              const percentage = currentTotal > 0 ? (amount / currentTotal) * 100 : 0;

              return (
                <Card key={category} style={styles.card}>
                  <CardContent style={styles.cardContent}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryLabel}>
                        <View style={[styles.categoryDot, { backgroundColor: meta.color }]} />
                        <Text style={styles.categoryName}>{meta.label}</Text>
                      </View>
                      <View style={styles.categoryValueWrapper}>
                        <Text style={styles.categoryAmount}>{amount.toFixed(2)} zł</Text>
                        <Text style={styles.categoryPercentage}>{percentage.toFixed(1)}%</Text>
                      </View>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: meta.color,
                            width: `${Math.max(Math.min(percentage, 100), 0)}%`,
                          },
                        ]}
                      />
                    </View>
                  </CardContent>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

