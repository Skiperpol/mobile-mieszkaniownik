import type { Expense } from '@/types/app';

/**
 * Calculates balance per member based on expenses.
 *
 * Positive balance means the member should receive money,
 * negative balance means they owe money.
 */
export function calculateMemberBalances(expenses: Expense[], members: string[] = []) {
  const balances: Record<string, number> = {};

  members.forEach((memberId) => {
    balances[memberId] = 0;
  });

  expenses.forEach((expense) => {
    if (expense.splitAmounts && Object.keys(expense.splitAmounts).length > 0) {
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
      Object.entries(expense.splitAmounts).forEach(([memberId, amount]) => {
        balances[memberId] = (balances[memberId] || 0) - amount;
      });
    } else if (expense.splitBetween.length > 0) {
      const splitAmount = expense.amount / expense.splitBetween.length;
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;
      expense.splitBetween.forEach((memberId) => {
        balances[memberId] = (balances[memberId] || 0) - splitAmount;
      });
    }
  });

  return balances;
}

