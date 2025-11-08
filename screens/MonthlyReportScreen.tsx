import { useAppStore } from '../store/useAppStore';
import { Header } from '../components/Header';
import { Card, CardContent } from '../components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface MonthlyReportScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
}

export function MonthlyReportScreen({ onNavigate, onBack }: MonthlyReportScreenProps) {
  const expenses = useAppStore((state) => state.expenses);
  const currentGroup = useAppStore((state) => state.currentGroup);

  // Current month expenses
  const now = new Date();
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === now.getMonth() &&
      expenseDate.getFullYear() === now.getFullYear()
    );
  });

  // Previous month expenses
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === previousMonth.getMonth() &&
      expenseDate.getFullYear() === previousMonth.getFullYear()
    );
  });

  const currentTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const previousTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const difference = currentTotal - previousTotal;
  const percentChange = previousTotal > 0 ? ((difference / previousTotal) * 100) : 0;

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  currentMonthExpenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }));

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: 'Jedzenie',
      shopping: 'Zakupy',
      utilities: 'Rachunki',
      entertainment: 'Rozrywka',
      settlement: 'Rozliczenia',
      other: 'Inne',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-500',
      shopping: 'bg-blue-500',
      utilities: 'bg-green-500',
      entertainment: 'bg-purple-500',
      settlement: 'bg-gray-500',
      other: 'bg-pink-500',
    };
    return colors[category] || colors.other;
  };

  const averagePerMember = currentTotal / (currentGroup?.members.length || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Raport miesięczny"
        showBack
        onBack={onBack || (() => onNavigate('expenses'))}
      />

      <div className="pt-14 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Obecny miesiąc</p>
                </div>
                <p className="text-2xl">{currentTotal.toFixed(2)} zł</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {difference >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <p className="text-sm text-gray-600">Zmiana</p>
                </div>
                <p className={`text-2xl ${difference >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {difference >= 0 ? '+' : ''}
                  {percentChange.toFixed(0)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Poprzedni miesiąc</p>
                <p>{previousTotal.toFixed(2)} zł</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Liczba wydatków</p>
                <p>{currentMonthExpenses.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Średnia na osobę</p>
                <p>{averagePerMember.toFixed(2)} zł</p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <h3 className="text-lg">Wydatki według kategorii</h3>

            {sortedCategories.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <PieChart className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500">Brak wydatków w tym miesiącu</p>
                </CardContent>
              </Card>
            ) : (
              sortedCategories.map(({ category, amount }) => {
                const percentage = (amount / currentTotal) * 100;
                return (
                  <Card key={category}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${getCategoryColor(category)}`} />
                          <p>{getCategoryLabel(category)}</p>
                        </div>
                        <div className="text-right">
                          <p className="mb-1">{amount.toFixed(2)} zł</p>
                          <p className="text-xs text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getCategoryColor(category)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}