import { format, parseISO } from 'date-fns';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/currencyFormatter';
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineHome,
  HiOutlineFilm,
  HiOutlineHeart,
  HiOutlineBolt,
  HiOutlineCreditCard,
  HiOutlineArrowPath,
  HiOutlineBanknotes,
  HiOutlineBriefcase,
} from 'react-icons/hi2';

// Each category has its own icon and color
const categoryConfig = {
  Food: { icon: HiOutlineShoppingBag, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Travel: { icon: HiOutlineTruck, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  Rent: { icon: HiOutlineHome, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  Shopping: { icon: HiOutlineCreditCard, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  Entertainment: { icon: HiOutlineFilm, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  Health: { icon: HiOutlineHeart, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  Utilities: { icon: HiOutlineBolt, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Subscriptions: { icon: HiOutlineArrowPath, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  Salary: { icon: HiOutlineBriefcase, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  Freelance: { icon: HiOutlineBanknotes, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  Other: { icon: HiOutlineBanknotes, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
};

// This card shows a single transaction (income or expense)
function TransactionCard({ transaction, onEdit, onDelete, index = 0 }) {
  // Get the icon and color for this category
  const config = categoryConfig[transaction.category] || categoryConfig.Other;
  const Icon = config.icon;

  // Format the date nicely (e.g., "27 Mar 2026")
  let formattedDate = transaction.date;
  try {
    const dateObj = typeof transaction.date === 'string'
      ? parseISO(transaction.date)
      : new Date(transaction.date);
    formattedDate = format(dateObj, 'dd MMM yyyy');
  } catch {
    // If date parsing fails, just show the raw date
  }

  return (
    <motion.div
      className="card transaction-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      {/* Category Icon */}
      <div
        className="transaction-card-icon"
        style={{ background: config.bg, color: config.color }}
      >
        <Icon />
      </div>

      {/* Transaction Details */}
      <div className="transaction-card-info">
        <div className="transaction-card-title">
          {transaction.title}
          {transaction.recurring && <span className="recurring-badge">Recurring</span>}
        </div>
        <div className="transaction-card-meta">
          <span>{transaction.category}</span>
          <span>{formattedDate}</span>
          {transaction.notes && <span>{transaction.notes}</span>}
        </div>
      </div>

      {/* Amount */}
      <div className={`transaction-card-amount ${transaction.type}`}>
        {transaction.type === 'expense' ? '−' : '+'} {formatCurrency(transaction.amount)}
      </div>

      {/* Edit and Delete Buttons */}
      <div className="transaction-card-actions">
        <button className="action-btn" onClick={() => onEdit(transaction)} title="Edit">
          <HiOutlinePencil />
        </button>
        <button className="action-btn delete" onClick={() => onDelete(transaction.id)} title="Delete">
          <HiOutlineTrash />
        </button>
      </div>
    </motion.div>
  );
}

export default TransactionCard;
