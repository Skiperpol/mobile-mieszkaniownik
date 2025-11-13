import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/hooks/useAppStore';
import { styles } from './SettleDebtScreen.style';

export default function SettleDebtScreen() {
  const router = useRouter();
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const settleDebt = useAppStore((state) => state.settleDebt);

  const balances: Record<string, number> = {};
  currentGroup?.members.forEach((memberId) => {
    balances[memberId] = 0;
  });

  expenses.forEach((expense) => {
    // Jeśli istnieje niestandardowy podział, użyj go
    if (expense.splitAmounts && Object.keys(expense.splitAmounts).length > 0) {
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
      Object.entries(expense.splitAmounts).forEach(([memberId, amount]) => {
        balances[memberId] = (balances[memberId] || 0) - amount;
      });
    } else {
      // Równy podział między wszystkich członków w splitBetween
      const splitAmount = expense.amount / expense.splitBetween.length;
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
      expense.splitBetween.forEach((memberId) => {
        balances[memberId] = (balances[memberId] || 0) - splitAmount;
      });
    }
  });

  const settlements: Array<{ from: string; to: string; amount: number }> = [];
  const debtors = Object.entries(balances)
    .filter(([, balance]) => balance < -0.01)
    .map(([id, balance]) => ({ id, amount: -balance }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.entries(balances)
    .filter(([, balance]) => balance > 0.01)
    .map(([id, balance]) => ({ id, amount: balance }))
    .sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i];
    const credit = creditors[j];

    const amount = Math.min(debt.amount, credit.amount);
    settlements.push({
      from: debt.id,
      to: credit.id,
      amount,
    });

    debt.amount -= amount;
    credit.amount -= amount;

    if (debt.amount < 0.01) i += 1;
    if (credit.amount < 0.01) j += 1;
  }

  const handleSettle = (from: string, to: string, amount: number) => {
    settleDebt(from, to, amount);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header title="Rozlicz długi" showBack onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={[styles.card, styles.highlightCard]}>
          <CardContent style={styles.cardContent}>
            <Text style={styles.cardTitle}>Minimalne przelewy</Text>
            <Text style={styles.cardDescription}>
              Poniżej znajduje się zoptymalizowana lista przelewów, aby rozliczyć wszystkie długi przy minimalnej liczbie transakcji.
            </Text>
          </CardContent>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Salda</Text>

          {Object.entries(balances).map(([memberId, balance]) => {
            const isPositive = balance >= 0;
            return (
              <Card key={memberId} style={styles.card}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.balanceRow}>
                    <View style={styles.balanceAvatar}>
                      <Text style={styles.balanceAvatarText}>{memberId[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={styles.balanceInfo}>
                      <Text style={styles.balanceName}>{memberId === user?.id ? 'Ty' : memberId}</Text>
                    </View>

                    <Text style={[styles.balanceValue, isPositive ? styles.balancePositive : styles.balanceNegative]}>
                      {isPositive ? '+' : ''}
                      {balance.toFixed(2)} zł
                    </Text>
                  </View>
                </CardContent>
              </Card>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Przelewy do wykonania</Text>

          {settlements.length === 0 ? (
            <Card style={styles.card}>
              <CardContent style={[styles.cardContent, styles.centerContent]}>
                <Ionicons name="checkmark-circle-outline" size={40} color="#10b981" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>Wszystkie długi rozliczone!</Text>
              </CardContent>
            </Card>
          ) : (
            settlements.map((settlement, index) => (
              <Card key={`${settlement.from}-${settlement.to}-${index}`} style={styles.card}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.transferRow}>
                    <View style={styles.transferParticipants}>
                      <View style={[styles.transferAvatar, styles.debtorAvatar]}>
                        <Text style={styles.transferAvatarText}>{settlement.from[0]?.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.transferName}>
                        {settlement.from === user?.id ? 'Ty' : settlement.from}
                      </Text>

                      <Ionicons name="arrow-forward" size={18} color="#9ca3af" style={styles.transferArrow} />

                      <View style={[styles.transferAvatar, styles.creditorAvatar]}>
                        <Text style={styles.transferAvatarText}>{settlement.to[0]?.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.transferName}>
                        {settlement.to === user?.id ? 'Ty' : settlement.to}
                      </Text>
                    </View>

                    <Text style={styles.transferAmount}>{settlement.amount.toFixed(2)} zł</Text>
                  </View>

                  {settlement.from === user?.id || settlement.to === user?.id ? (
                    <Button
                      variant="outline"
                      size="sm"
                      style={styles.fullWidthButton}
                      onPress={() => handleSettle(settlement.from, settlement.to, settlement.amount)}
                    >
                      Oznacz jako rozliczone
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

