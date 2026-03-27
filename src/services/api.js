import axios from 'axios';

// Fetch exchange rates for a given currency
export async function fetchExchangeRates(currency) {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${currency}`
  );
  return response.data;
}
