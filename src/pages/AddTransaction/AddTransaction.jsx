import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useTransactions } from '../../hooks/useTransactions';
import { HiOutlineCheckCircle } from 'react-icons/hi2';

// Validation rules — what the user must fill in
const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'At least 2 characters'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required').typeError('Enter a valid number'),
  category: yup.string().required('Select a category'),
  type: yup.string().oneOf(['income', 'expense'], 'Select a type').required('Type is required'),
  date: yup.string().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean(),
});

// Categories for expenses
const expenseCategories = ['Food', 'Travel', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Utilities', 'Subscriptions', 'Other'];

// Categories for income
const incomeCategories = ['Salary', 'Freelance', 'Other'];

function AddTransaction() {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  // Set up the form with react-hook-form + yup validation
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0], // Today's date
      notes: '',
      recurring: false,
    },
  });

  // Watch the type field to show correct categories
  const selectedType = watch('type');
  const categories = selectedType === 'income' ? incomeCategories : expenseCategories;

  // This runs when the form is submitted
  function onSubmit(data) {
    addTransaction({
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      type: data.type,
      date: data.date,
      notes: data.notes || '',
      recurring: data.recurring || false,
    });

    toast.success('Transaction added successfully!');
    reset();
    navigate('/transactions');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Title */}
      <div className="page-header">
        <h1>Add Transaction</h1>
        <p>Record a new income or expense.</p>
      </div>

      {/* Form Card */}
      <div className="card" style={{ maxWidth: 720, padding: '2rem' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">

            {/* Transaction Type Toggle (Expense / Income) */}
            <div className="form-group full-width">
              <label className="form-label">Transaction Type</label>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {/* Expense Button */}
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedType === 'expense' ? 'var(--accent-red)' : 'var(--border-color)'}`,
                  background: selectedType === 'expense' ? 'var(--accent-red-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: selectedType === 'expense' ? 'var(--accent-red)' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}>
                  <input type="radio" value="expense" {...register('type')} style={{ display: 'none' }} />
                  Expense
                </label>

                {/* Income Button */}
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${selectedType === 'income' ? 'var(--accent-green)' : 'var(--border-color)'}`,
                  background: selectedType === 'income' ? 'var(--accent-green-bg)' : 'transparent',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: selectedType === 'income' ? 'var(--accent-green)' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}>
                  <input type="radio" value="income" {...register('type')} style={{ display: 'none' }} />
                  Income
                </label>
              </div>
              {errors.type && <span className="form-error">{errors.type.message}</span>}
            </div>

            {/* Title Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="txn-title">Title</label>
              <input
                id="txn-title"
                className="form-input"
                placeholder="e.g., Grocery shopping"
                {...register('title')}
              />
              {errors.title && <span className="form-error">{errors.title.message}</span>}
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="txn-amount">Amount (₹)</label>
              <input
                id="txn-amount"
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                {...register('amount')}
              />
              {errors.amount && <span className="form-error">{errors.amount.message}</span>}
            </div>

            {/* Category Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="txn-category">Category</label>
              <select id="txn-category" className="form-select" {...register('category')}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="form-error">{errors.category.message}</span>}
            </div>

            {/* Date Picker */}
            <div className="form-group">
              <label className="form-label" htmlFor="txn-date">Date</label>
              <input id="txn-date" type="date" className="form-input" {...register('date')} />
              {errors.date && <span className="form-error">{errors.date.message}</span>}
            </div>

            {/* Recurring Checkbox */}
            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
              <label className="form-checkbox-wrap">
                <input type="checkbox" className="form-checkbox" {...register('recurring')} />
                Recurring transaction
              </label>
            </div>

            {/* Notes */}
            <div className="form-group full-width">
              <label className="form-label" htmlFor="txn-notes">Notes (optional)</label>
              <textarea
                id="txn-notes"
                className="form-textarea"
                rows="3"
                placeholder="Add any additional details..."
                {...register('notes')}
              />
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <HiOutlineCheckCircle /> Add Transaction
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default AddTransaction;
