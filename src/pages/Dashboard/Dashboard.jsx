import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../hooks/useTransactions';
import { useBudget } from '../../hooks/useBudget';
import { formatCurrency } from '../../utils/currencyFormatter';
import { CategoryPieChart, MonthlyTrendChart } from '../../components/Charts/Charts';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineBanknotes,
  HiOutlineStar,
} from 'react-icons/hi2';

function Dashboard() {
  const navigate = useNavigate();
  const { transactions, analytics } = useTransactions();
  const budgetData = useBudget();

  // Show only the 5 most recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Title */}
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here&apos;s your financial overview.</p>
      </div>

      {/* ===== Metric Cards ===== */}
      <div className="metric-cards">

        {/* Total Income Card */}
        <div className="card metric-card income">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineArrowTrendingUp /></div>
            <span className="metric-card-label">Total Income</span>
          </div>
          <div className="metric-card-value income">
            {formatCurrency(analytics.totalIncome)}
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="card metric-card expense">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineArrowTrendingDown /></div>
            <span className="metric-card-label">Total Expenses</span>
          </div>
          <div className="metric-card-value expense">
            {formatCurrency(analytics.totalExpenses)}
          </div>
        </div>

        {/* Net Balance Card */}
        <div className="card metric-card balance">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineBanknotes /></div>
            <span className="metric-card-label">Net Balance</span>
          </div>
          <div className="metric-card-value">
            {formatCurrency(analytics.netBalance)}
          </div>
        </div>

        {/* Top Spending Category Card */}
        <div className="card metric-card category">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineStar /></div>
            <span className="metric-card-label">Top Category</span>
          </div>
          <div className="metric-card-value" style={{ fontSize: '1.25rem' }}>
            {analytics.topCategory ? analytics.topCategory[0] : '—'}
          </div>
          {analytics.topCategory && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {formatCurrency(analytics.topCategory[1])} spent
            </div>
          )}
        </div>
      </div>

      {/* ===== Budget Overview ===== */}
      <BudgetCard
        monthlyBudget={budgetData.monthlyBudget}
        totalSpending={budgetData.totalSpending}
        remaining={budgetData.remaining}
        percentUsed={budgetData.percentUsed}
      />

      {/* ===== Charts ===== */}
      <div className="charts-grid" style={{ marginTop: '2rem' }}>
        <div className="card chart-card">
          <h3>Spending by Category</h3>
          <CategoryPieChart data={analytics.categoryBreakdown} />
        </div>
        <div className="card chart-card">
          <h3>Monthly Trend</h3>
          <MonthlyTrendChart data={analytics.monthlyTrend} />
        </div>
      </div>

      {/* ===== Recent Transactions ===== */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-heading)' }}>
            Recent Transactions
          </h3>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/transactions')}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            View All
          </button>
        </div>

        {/* Show empty state if no transactions yet */}
        {recentTransactions.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No transactions yet</h3>
            <p>Add your first transaction to see your financial overview.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/transactions/new')}
              style={{ marginTop: '1rem' }}
            >
              Add Transaction
            </button>
          </div>
        ) : (
          recentTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              index={index}
              onEdit={() => navigate('/transactions')}
              onDelete={() => { }}
            />
          ))
        )}
      </div>
    </motion.div>
  );
}

export default Dashboard;
