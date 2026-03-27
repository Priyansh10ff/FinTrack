import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function useBudget() {
  const { budget, setBudget, transactions } = useContext(FinanceContext);

  const budgetData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get this month's expenses
    const monthlySpending = transactions
      .filter((t) => {
        const date = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date);
        return t.type === 'expense' && isWithinInterval(date, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const remaining = budget.monthlyBudget - monthlySpending;

    // Calculate percentage used (cap at 100%)
    const percentUsed = budget.monthlyBudget > 0
      ? Math.min((monthlySpending / budget.monthlyBudget) * 100, 100)
      : 0;

    // Category-wise spending for this month
    const categorySpending = {};
    transactions
      .filter((t) => {
        const date = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date);
        return t.type === 'expense' && isWithinInterval(date, { start: monthStart, end: monthEnd });
      })
      .forEach((t) => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + Number(t.amount);
      });

    return {
      monthlyBudget: budget.monthlyBudget,
      totalSpending: monthlySpending,
      remaining,
      percentUsed,
      isOverBudget: remaining < 0,
      categorySpending,
    };
  }, [budget, transactions]);

  return { ...budgetData, setBudget };
}
