import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAppStore } from '../store/useAppStore';

interface SettleDebtScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function SettleDebtScreen({ onNavigate, onBack }: SettleDebtScreenProps) {
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const settleDebt = useAppStore((state) => state.settleDebt);

  const balances: Record<string, number> = {};
  currentGroup?.members.forEach((memberId) => {
    balances[memberId] = 0;
  });

  expenses.forEach((expense) => {
    const splitAmount = expense.amount / expense.splitBetween.length;
    balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
    expense.splitBetween.forEach((memberId) => {
      balances[memberId] = (balances[memberId] || 0) - splitAmount;
    });
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
    onNavigate('expenses');
  };

  return (
    <View style={styles.container}>
      <Header title="Rozlicz długi" showBack onBack={onBack || (() => onNavigate('expenses'))} />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    marginBottom: 16,
  },
  highlightCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1d4ed8',
  },
  cardDescription: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  balanceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  balanceName: {
    fontSize: 16,
    color: '#111827',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  balancePositive: {
    color: '#15803d',
  },
  balanceNegative: {
    color: '#b91c1c',
  },
  transferRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transferParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transferAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtorAvatar: {
    backgroundColor: '#fee2e2',
    marginRight: 6,
  },
  creditorAvatar: {
    backgroundColor: '#dcfce7',
    marginLeft: 6,
    marginRight: 6,
  },
  transferAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  transferName: {
    fontSize: 14,
    color: '#1f2937',
  },
  transferArrow: {
    marginHorizontal: 4,
  },
  transferAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  centerContent: {
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  fullWidthButton: {
    width: '100%',
  },
});