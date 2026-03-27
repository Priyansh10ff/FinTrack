import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../services/api';
import { formatCurrency } from '../utils/currencyFormatter';

export function useCurrency() {
  const [rates, setRates] = useState({});
  const [targetCurrency, setTargetCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exchange rates on mount
  useEffect(() => {
    async function loadRates() {
      setLoading(true);
      try {
        const data = await fetchExchangeRates('INR');
        setRates(data.rates || {});
      } catch (err) {
        setError('Failed to load exchange rates');
      }
      setLoading(false);
    }
    loadRates();
  }, []);

  // Convert amount from INR to selected currency
  function convert(amount) {
    if (targetCurrency === 'INR') return amount;
    const rate = rates[targetCurrency];
    return rate ? amount * rate : amount;
  }

  // Format amount in the selected currency
  function formatAmount(amount) {
    return formatCurrency(convert(amount), targetCurrency);
  }

  return {
    rates,
    targetCurrency,
    setTargetCurrency,
    convert,
    formatAmount,
    loading,
    error,
  };
}
