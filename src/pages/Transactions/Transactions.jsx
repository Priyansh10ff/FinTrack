import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useTransactions } from '../../hooks/useTransactions';
import { useDebounce } from '../../hooks/useDebounce';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import { HiOutlinePlusCircle } from 'react-icons/hi2';

// Validation rules for the edit form
const editSchema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().positive('Must be positive').required('Amount is required').typeError('Enter a valid number'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean(),
});

// Category options (used in the edit modal)
const expenseCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions', 'Other'];
const incomeCategories = ['Salary', 'Freelance', 'Other'];

function Transactions() {
  const navigate = useNavigate();
  const { transactions, updateTransaction, deleteTransaction } = useTransactions();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Filter state
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Edit modal state
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter and sort the transactions based on user selections
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // 1. Search by title or notes
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.notes && t.notes.toLowerCase().includes(query))
      );
    }

    // 2. Filter by category
    if (filterCategory !== 'All') {
      result = result.filter((t) => t.category === filterCategory);
    }

    // 3. Filter by type (income/expense)
    if (filterType !== 'All') {
      result = result.filter((t) => t.type === filterType);
    }

    // 4. Filter by date range
    if (dateFrom) {
      const fromDate = startOfDay(parseISO(dateFrom));
      result = result.filter((t) => {
        const txnDate = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date);
        return isAfter(txnDate, fromDate) || txnDate.getTime() === fromDate.getTime();
      });
    }
    if (dateTo) {
      const toDate = endOfDay(parseISO(dateTo));
      result = result.filter((t) => {
        const txnDate = typeof t.date === 'string' ? parseISO(t.date) : new Date(t.date);
        return isBefore(txnDate, toDate) || txnDate.getTime() === toDate.getTime();
      });
    }

    // 5. Sort the results
    const [sortField, sortDirection] = sortBy.split('-');
    result.sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
      }
      if (sortField === 'amount') {
        return sortDirection === 'desc'
          ? Number(b.amount) - Number(a.amount)
          : Number(a.amount) - Number(b.amount);
      }
      if (sortField === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [transactions, debouncedSearch, filterCategory, filterType, sortBy, dateFrom, dateTo]);

  // Handle deleting a transaction
  function handleDelete(id) {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  }

  // Handle opening the edit modal
  function handleEdit(transaction) {
    setEditingTransaction(transaction);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Transactions</h1>
          <p>{transactions.length} total transactions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/transactions/new')}>
          <HiOutlinePlusCircle /> Add New
        </button>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="toolbar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <Filters
          category={filterCategory}
          onCategoryChange={setFilterCategory}
          type={filterType}
          onTypeChange={setFilterType}
          sortBy={sortBy}
          onSortChange={setSortBy}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No transactions found</h3>
          <p>
            {transactions.length === 0
              ? 'Add your first transaction to get started.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <AnimatePresence>
          {filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              index={index}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      )}

      {/* Edit Modal (shows when editing a transaction) */}
      <AnimatePresence>
        {editingTransaction && (
          <EditModal
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onSave={(updatedData) => {
              updateTransaction(updatedData);
              setEditingTransaction(null);
              toast.success('Transaction updated');
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ===== Edit Modal Component =====
// This pops up when user clicks the edit button on a transaction
function EditModal({ transaction, onClose, onSave }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(editSchema),
    defaultValues: {
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: typeof transaction.date === 'string'
        ? transaction.date.split('T')[0]
        : new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || '',
      recurring: transaction.recurring || false,
    },
  });

  // Watch the type to show correct categories
  const selectedType = watch('type');
  const categories = selectedType === 'income' ? incomeCategories : expenseCategories;

  function onSubmit(data) {
    onSave({ ...data, id: transaction.id });
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Transaction</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" {...register('title')} />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input type="number" className="form-input" step="0.01" {...register('amount')} />
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" {...register('type')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" {...register('category')}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" {...register('date')} />
              {errors.date && <span className="form-error">{errors.date.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-checkbox-wrap">
                <input type="checkbox" className="form-checkbox" {...register('recurring')} />
                Recurring expense
              </label>
            </div>

            <div className="form-group full-width">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" rows="2" {...register('notes')} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Transactions;
