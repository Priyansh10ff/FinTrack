import { motion } from 'framer-motion';
import { useTransactions } from '../../hooks/useTransactions';
import { useCurrency } from '../../hooks/useCurrency';
import { formatCurrency } from '../../utils/currencyFormatter';
import {
  CategoryPieChart,
  MonthlyTrendChart,
  IncomeExpenseBarChart,
} from '../../components/Charts/Charts';
import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineBanknotes,
  HiOutlineStar,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';

// Currencies supported for conversion
const supportedCurrencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

function Analytics() {
  const { analytics } = useTransactions();
  const {
    targetCurrency, setTargetCurrency,
    formatAmount, rates, loading, error,
  } = useCurrency();

  // Display amount in either INR or converted currency
  function displayAmount(amount) {
    if (targetCurrency === 'INR') {
      return formatCurrency(amount, 'INR');
    }
    return formatAmount(amount);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Title */}
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Detailed financial insights and spending analysis.</p>
      </div>

      {/* ===== Currency Converter ===== */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div className="currency-card">
          <HiOutlineGlobeAlt style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)' }} />
          <label>View amounts in:</label>
          <select
            id="currency-selector"
            className="filter-select"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value)}
            style={{ minWidth: 120 }}
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <span className="currency-rate">
            {loading
              ? 'Loading rates...'
              : error
                ? error
                : targetCurrency !== 'INR' && rates[targetCurrency]
                  ? `1 INR = ${rates[targetCurrency].toFixed(4)} ${targetCurrency}`
                  : ''}
          </span>
        </div>
      </div>

      {/* ===== Metric Cards ===== */}
      <div className="metric-cards">
        {/* Total Income */}
        <div className="card metric-card income">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineArrowTrendingUp /></div>
            <span className="metric-card-label">Total Income</span>
          </div>
          <div className="metric-card-value income">
            {displayAmount(analytics.totalIncome)}
          </div>
        </div>

        {/* Total Expenses */}
        <div className="card metric-card expense">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineArrowTrendingDown /></div>
            <span className="metric-card-label">Total Expenses</span>
          </div>
          <div className="metric-card-value expense">
            {displayAmount(analytics.totalExpenses)}
          </div>
        </div>

        {/* Net Balance */}
        <div className="card metric-card balance">
          <div className="metric-card-header">
            <div className="metric-card-icon"><HiOutlineBanknotes /></div>
            <span className="metric-card-label">Net Balance</span>
          </div>
          <div className="metric-card-value">
            {displayAmount(analytics.netBalance)}
          </div>
        </div>

        {/* Top Category */}
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
              {displayAmount(analytics.topCategory[1])} spent
            </div>
          )}
        </div>
      </div>

      {/* ===== Charts Row 1: Pie + Line ===== */}
      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Spending by Category</h3>
          <CategoryPieChart data={analytics.categoryBreakdown} />
        </div>
        <div className="card chart-card">
          <h3>Monthly Spending Trend</h3>
          <MonthlyTrendChart data={analytics.monthlyTrend} />
        </div>
      </div>

      {/* ===== Charts Row 2: Bar Chart ===== */}
      <div className="charts-grid">
        <div className="card chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Income vs Expenses</h3>
          <IncomeExpenseBarChart data={analytics.monthlyTrend} />
        </div>
      </div>
    </motion.div>
  );
}

export default Analytics;
