import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useBudget } from '../../hooks/useBudget';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import { formatCurrency } from '../../utils/currencyFormatter';
import { HiOutlinePencilSquare, HiOutlineCheckCircle } from 'react-icons/hi2';

// Emoji for each spending category
const CATEGORY_EMOJIS = {
  Food: '🍔', Travel: '✈️', Rent: '🏠', Shopping: '🛍️',
  Entertainment: '🎬', Health: '💊', Utilities: '⚡',
  Subscriptions: '📺', Other: '📦',
};

function Budget() {
  const {
    monthlyBudget, totalSpending, remaining,
    percentUsed, categorySpending, setBudget,
  } = useBudget();

  // State for editing the budget
  const [editing, setEditing] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget);

  // Save the new budget amount
  function handleSave() {
    const amount = Number(budgetInput);
    if (amount > 0) {
      setBudget(amount);
      setEditing(false);
      toast.success('Budget updated!');
    } else {
      toast.error('Enter a valid budget amount');
    }
  }

  // Sort categories by highest spending first
  const sortedCategories = Object.entries(categorySpending).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Title */}
      <div className="page-header">
        <h1>Budget</h1>
        <p>Set and track your monthly spending budget.</p>
      </div>

      {/* ===== Set Monthly Budget ===== */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Monthly Budget
            </div>

            {editing ? (
              // Show input field when editing
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  className="form-input"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  style={{ width: 180, fontSize: '1.1rem', fontWeight: 700 }}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={handleSave} style={{ padding: '0.5rem 1rem' }}>
                  <HiOutlineCheckCircle /> Save
                </button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)} style={{ padding: '0.5rem 1rem' }}>
                  Cancel
                </button>
              </div>
            ) : (
              // Show current budget with edit button
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {formatCurrency(monthlyBudget)}
                </span>
                <button className="action-btn" onClick={() => { setEditing(true); setBudgetInput(monthlyBudget); }}>
                  <HiOutlinePencilSquare />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Budget Progress Card ===== */}
      <BudgetCard
        monthlyBudget={monthlyBudget}
        totalSpending={totalSpending}
        remaining={remaining}
        percentUsed={percentUsed}
      />

      {/* ===== Category-wise Spending Breakdown ===== */}
      <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
          Category-wise Spending (This Month)
        </h3>

        {sortedCategories.length === 0 ? (
          <div className="empty-state" style={{ padding: '1.5rem' }}>
            <p>No expenses this month.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedCategories.map(([categoryName, amount]) => {
              // Calculate what percentage this category is of total spending
              const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;

              return (
                <div key={categoryName}>
                  {/* Category name and amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {CATEGORY_EMOJIS[categoryName] || '📦'} {categoryName}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>

                  {/* Progress bar for this category */}
                  <div style={{ width: '100%', height: 6, background: 'var(--bg-input)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', borderRadius: 'var(--radius-full)', background: 'var(--accent-primary)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Budget;
