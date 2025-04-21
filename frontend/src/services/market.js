import debounce from 'lodash.debounce';
import axios from 'axios';

const API_URL = 'http://localhost:8099';

// API service instance
const marketApi = axios.create({
  baseURL: API_URL,
});

// Fetch market coins by category
const getMarketCoins = async (category) => {
  try {
    const response = await marketApi.get(`/market/coins?category=${category.toLowerCase()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch market coins');
  }
};

// Fetch top gainers
const getTopGainers = async () => {
  try {
    const response = await marketApi.get('/market/top-gainers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch top gainers');
  }
};

// Debounced fetch market data
const fetchMarketData = debounce(async (category, setAllCoins, setTopGainers, setIsLoading, toast) => {
  setIsLoading(true);
  try {
    const coins = await getMarketCoins(category);
    const gainers = await getTopGainers();
    setAllCoins(coins.map((coin, index) => ({
      id: String(index + 1).padStart(2, '0'),
      currency: coin.currency,
      ticker: coin.ticker,
      logo_url: coin.logo_url && coin.logo_url.trim() !== '' ? coin.logo_url : 'https://via.placeholder.com/40',
      price: `$${coin.price_usd.toLocaleString('en-US')}`,
      last24h: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h}%`,
      last7d: `${coin.change_7d > 0 ? '+' : ''}${coin.change_7d}%`,
    })));
    setTopGainers(gainers.map(gainer => ({
      currency: gainer.currency,
      ticker: gainer.ticker,
      price: `USD ${gainer.price_usd.toLocaleString('en-US')}`,
      change: `${gainer.change_24h > 0 ? '+' : ''}${gainer.change_24h}%`,
      logo_url: gainer.logo_url && gainer.logo_url.trim() !== '' ? gainer.logo_url : 'https://via.placeholder.com/40',
    })));
  } catch (error) {
    toast.error(error.message || 'Failed to fetch market data');
    setAllCoins([]);
    setTopGainers([]);
  } finally {
    setIsLoading(false);
  }
}, 1000);

export default {
  getMarketCoins,
  getTopGainers,
  fetchMarketData,
};