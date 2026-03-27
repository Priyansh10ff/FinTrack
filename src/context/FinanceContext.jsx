import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the context
export const FinanceContext = createContext();

// Helper to load data from localStorage
function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Provider component that wraps the entire app
export function FinanceProvider({ children }) {
  // State for transactions and budget
  const [transactions, setTransactions] = useState(
    loadFromStorage('fintrack_transactions', [])
  );
  const [budget, setBudgetState] = useState(
    loadFromStorage('fintrack_budget', { monthlyBudget: 50000 })
  );

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('fintrack_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fintrack_budget', JSON.stringify(budget));
  }, [budget]);

  // Add a new transaction
  function addTransaction(transaction) {
    setTransactions((prev) => [{ ...transaction, id: uuidv4() }, ...prev]);
  }

  // Update an existing transaction
  function updateTransaction(updated) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t))
    );
  }

  // Delete a transaction by id
  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  // Set the monthly budget amount
  function setBudget(amount) {
    setBudgetState({ monthlyBudget: amount });
  }

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setBudget,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
