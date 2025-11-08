import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight } from 'lucide-react';

interface SettleDebtScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function SettleDebtScreen({ onNavigate, onBack }: SettleDebtScreenProps) {
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);
  const user = useAppStore((state) => state.user);
  const settleDebt = useAppStore((state) => state.settleDebt);

  // Calculate balances
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

  // Calculate settlements (simplified greedy algorithm)
  const settlements: Array<{ from: string; to: string; amount: number }> = [];
  const debtors = Object.entries(balances)
    .filter(([_, balance]) => balance < -0.01)
    .map(([id, balance]) => ({ id, amount: -balance }))
    .sort((a, b) => b.amount - a.amount);

  const creditors = Object.entries(balances)
    .filter(([_, balance]) => balance > 0.01)
    .map(([id, balance]) => ({ id, amount: balance }))
    .sort((a, b) => b.amount - a.amount);

  let i = 0,
    j = 0;
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

    if (debt.amount < 0.01) i++;
    if (credit.amount < 0.01) j++;
  }

  const handleSettle = (from: string, to: string, amount: number) => {
    settleDebt(from, to, amount);
    onNavigate('expenses');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Rozlicz długi"
        showBack
        onBack={onBack || (() => onNavigate('expenses'))}
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="mb-2">Minimalne przelewy</h3>
              <p className="text-sm text-gray-700">
                Poniżej znajduje się zoptymalizowana lista przelewów, aby rozliczyć wszystkie długi przy minimalnej liczbie transakcji.
              </p>
            </CardContent>
          </Card>

          {/* Balances */}
          <div className="space-y-3">
            <h3 className="text-lg">Salda</h3>

            {Object.entries(balances).map(([memberId, balance]) => (
              <Card key={memberId}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span>{memberId[0]?.toUpperCase()}</span>
                      </div>
                      <p>{memberId === user?.id ? 'Ty' : memberId}</p>
                    </div>
                    <p
                      className={`text-lg ${
                        balance >= 0 ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {balance >= 0 ? '+' : ''}
                      {balance.toFixed(2)} zł
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Settlements */}
          <div className="space-y-3">
            <h3 className="text-lg">Przelewy do wykonania</h3>

            {settlements.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">Wszystkie długi rozliczone!</p>
                </CardContent>
              </Card>
            ) : (
              settlements.map((settlement, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">
                          {settlement.from[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm">
                          {settlement.from === user?.id ? 'Ty' : settlement.from}
                        </span>

                        <ArrowRight className="w-4 h-4 text-gray-400 mx-1" />

                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm">
                          {settlement.to[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm">
                          {settlement.to === user?.id ? 'Ty' : settlement.to}
                        </span>
                      </div>

                      <p className="text-lg ml-4">{settlement.amount.toFixed(2)} zł</p>
                    </div>

                    {(settlement.from === user?.id || settlement.to === user?.id) && (
                      <Button
                        onClick={() =>
                          handleSettle(settlement.from, settlement.to, settlement.amount)
                        }
                        className="w-full"
                        variant="outline"
                        size="sm"
                      >
                        Oznacz jako rozliczone
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}