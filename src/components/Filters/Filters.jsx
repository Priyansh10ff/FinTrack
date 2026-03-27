// List of all expense categories we support
const categories = [
  'All', 'Food', 'Travel', 'Rent', 'Shopping',
  'Entertainment', 'Health', 'Utilities', 'Subscriptions',
  'Salary', 'Freelance', 'Other',
];

// Transaction types
const types = ['All', 'income', 'expense'];

// Sorting options
const sortOptions = [
  { value: 'date-desc', label: 'Date (Newest)' },
  { value: 'date-asc', label: 'Date (Oldest)' },
  { value: 'amount-desc', label: 'Amount (High → Low)' },
  { value: 'amount-asc', label: 'Amount (Low → High)' },
  { value: 'category', label: 'Category (A–Z)' },
];

// Filter controls for the transactions page
function Filters({
  category, onCategoryChange,
  type, onTypeChange,
  sortBy, onSortChange,
  dateFrom, dateTo,
  onDateFromChange, onDateToChange,
}) {
  return (
    <>
      {/* Category Filter */}
      <select
        id="filter-category"
        className="filter-select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat === 'All' ? 'All Categories' : cat}
          </option>
        ))}
      </select>

      {/* Type Filter (Income / Expense) */}
      <select
        id="filter-type"
        className="filter-select"
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        {types.map((t) => (
          <option key={t} value={t}>
            {t === 'All' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>

      {/* Sort By */}
      <select
        id="sort-by"
        className="filter-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Date Range Filters */}
      <input
        type="date"
        className="filter-select"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        title="From date"
      />
      <input
        type="date"
        className="filter-select"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        title="To date"
      />
    </>
  );
}

export default Filters;
