import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { startOfMonth, endOfMonth, isWithinInterval, format, parseISO } from 'date-fns';

export function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useContext(FinanceContext);

  // Calculate all analytics from transactions
  const analytics = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Helper to parse date strings
    function parseDate(date) {
      return typeof date === 'string' ? parseISO(date) : new Date(date);
    }

    // Filter current month transactions
    const thisMonthTxns = transactions.filter((t) =>
      isWithinInterval(parseDate(t.date), { start: monthStart, end: monthEnd })
    );

    // Total income (all time)
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Total expenses (all time)
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // This month's expenses
    const monthlyExpenses = thisMonthTxns
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // This month's income
    const monthlyIncome = thisMonthTxns
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Spending by category
    const categoryBreakdown = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + Number(t.amount);
      });

    // Find the top spending category
    const categories = Object.entries(categoryBreakdown);
    const topCategory = categories.length > 0
      ? categories.sort((a, b) => b[1] - a[1])[0]
      : null;

    // Monthly trend for last 6 months
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStart = startOfMonth(date);
      const mEnd = endOfMonth(date);
      const label = format(date, 'MMM yyyy');

      const income = transactions
        .filter((t) => t.type === 'income' && isWithinInterval(parseDate(t.date), { start: mStart, end: mEnd }))
        .reduce((s, t) => s + Number(t.amount), 0);

      const expense = transactions
        .filter((t) => t.type === 'expense' && isWithinInterval(parseDate(t.date), { start: mStart, end: mEnd }))
        .reduce((s, t) => s + Number(t.amount), 0);

      monthlyTrend.push({ month: label, income, expense });
    }

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      monthlyExpenses,
      monthlyIncome,
      categoryBreakdown,
      topCategory,
      monthlyTrend,
    };
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    analytics,
  };
}
