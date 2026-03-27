import { formatCurrency } from '../../utils/currencyFormatter';
import { motion } from 'framer-motion';

// Shows the budget progress — how much is spent vs the monthly budget
function BudgetCard({ monthlyBudget, totalSpending, remaining, percentUsed }) {

  // Change the color based on how much budget is used
  let progressClass = '';
  if (percentUsed >= 90) {
    progressClass = 'danger';  // Red when almost over budget
  } else if (percentUsed >= 70) {
    progressClass = 'warning'; // Yellow when getting close
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="budget-progress-wrap">

        {/* Header with label and percentage */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Monthly Budget Usage
          </span>
          <span style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: percentUsed >= 90 ? 'var(--accent-red)' : 'var(--text-heading)'
          }}>
            {percentUsed.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="budget-progress-bar">
          <motion.div
            className={`budget-progress-fill ${progressClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentUsed, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Budget Stats (Budget, Spent, Remaining) */}
        <div className="budget-stats" style={{ marginTop: '1.5rem' }}>
          <div className="budget-stat">
            <div className="budget-stat-label">Budget</div>
            <div className="budget-stat-value" style={{ color: 'var(--text-heading)' }}>
              {formatCurrency(monthlyBudget)}
            </div>
          </div>
          <div className="budget-stat">
            <div className="budget-stat-label">Spent</div>
            <div className="budget-stat-value" style={{ color: 'var(--accent-red)' }}>
              {formatCurrency(totalSpending)}
            </div>
          </div>
          <div className="budget-stat">
            <div className="budget-stat-label">Remaining</div>
            <div className="budget-stat-value"
              style={{ color: remaining >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              {formatCurrency(Math.abs(remaining))}
              {remaining < 0 && (
                <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>over</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BudgetCard;
