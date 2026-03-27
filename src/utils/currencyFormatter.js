/**
 * Format a number as currency
 * Example: formatCurrency(5000) => "₹5,000"
 * Example: formatCurrency(100, 'USD') => "$100"
 */
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
