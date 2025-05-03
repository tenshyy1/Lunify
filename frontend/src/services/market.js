import debounce from 'lodash.debounce';
import api from './api';


//if dont use api
const generatePerformanceData = (currentPrice, change24h) => {
  const dataPoints = 24;
  const price24hAgo = currentPrice / (1 + change24h / 100);
  const priceDiff = currentPrice - price24hAgo;
  const step = priceDiff / (dataPoints - 1);
  const data = Array.from({ length: dataPoints }, (_, i) => {
    const basePrice = price24hAgo + step * i;
    const noise = (Math.random() - 0.5) * priceDiff * 0.05;
    return Math.max(basePrice + noise, 0);
  });
  return data;
};

const getMarketCoins = async (category) => {
  try {
    const response = await api.get(`/market/coins?category=${category.toLowerCase()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch market coins');
  }
};

const getTopGainers = async () => {
  try {
    const response = await api.get('/market/top-gainers');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch top gainers');
  }
};

const fetchMarketData = debounce(async (category, setAllCoins, setTopGainers, setIsLoading, toast) => {
  setIsLoading(true);
  try {
    const coins = await getMarketCoins(category);
    const gainers = await getTopGainers();
    setAllCoins(coins.map((coin, index) => {
      const priceNum = parseFloat(coin.price_usd);
      const change24h = parseFloat(coin.change_24h);
      return {
        id: String(index + 1).padStart(2, '0'),
        currency: coin.currency,
        ticker: coin.ticker,
        logo_url: coin.logo_url && coin.logo_url.trim() !== '' ? coin.logo_url : 'https://via.placeholder.com/40',
        price: `$${coin.price_usd.toLocaleString('en-US')}`,
        last24h: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h.toFixed(2)}%`,
        last7d: `${coin.change_7d > 0 ? '+' : ''}${coin.change_7d.toFixed(2)}%`,
        price_history: coin.price_history || [],
        performanceData: generatePerformanceData(priceNum, change24h),
      };
    }));
    setTopGainers(gainers.map(gainer => ({
      currency: gainer.currency,
      ticker: gainer.ticker,
      price: `USD ${gainer.price_usd.toLocaleString('en-US')}`,
      change: `${gainer.change_24h > 0 ? '+' : ''}${gainer.change_24h.toFixed(2)}%`,
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