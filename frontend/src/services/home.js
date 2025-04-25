import debounce from 'lodash.debounce';
import api from './api';

const getMarketCoins = async (category = 'popular') => {
  try {
    const response = await api.get(`/market/coins?category=${category.toLowerCase()}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch market coins');
  }
};

const fetchHomeData = debounce(async (setPopularCryptos, setCryptoDataByCategory, setIsLoading, categories, categoryTickers) => {
  setIsLoading(true);
  try {
    const coins = await getMarketCoins('popular');

    const popularTickers = ['BTC', 'ETH', 'SOL', 'TON'];
    const popularCoins = coins.filter(coin => popularTickers.includes(coin.ticker));
    const formattedPopularCryptos = popularCoins.map((coin, index) => {
      const currentPrice = coin.price_usd;
      const chartDataPoints = Array(7).fill(0).map((_, i) => {
        const variation = (Math.random() - 0.5) * currentPrice * 0.05;
        return Math.max(currentPrice + variation * (i / 6), 0);
      });
      chartDataPoints[6] = currentPrice;

      return {
        name: coin.ticker,
        fullName: coin.currency,
        price: currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        change: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h}%`,
        logo_url: coin.logo_url && coin.logo_url.trim() !== '' ? coin.logo_url : 'https://via.placeholder.com/40',
        chartData: {
          labels: ['1', '2', '3', '4', '5', '6', '7'],
          datasets: [
            {
              data: chartDataPoints,
              borderColor: coin.change_24h >= 0 ? '#34c759' : '#ff3b30',
              backgroundColor: coin.change_24h >= 0 ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
      };
    });
    setPopularCryptos(formattedPopularCryptos);

    const allCoinsFormatted = coins.map((coin, index) => {
      const currentPrice = coin.price_usd;
      const chartDataPoints = Array(7).fill(0).map((_, i) => {
        const variation = (Math.random() - 0.5) * currentPrice * 0.05;
        return Math.max(currentPrice + variation * (i / 6), 0);
      });
      chartDataPoints[6] = currentPrice;

      return {
        id: (index % 7) + 1,
        name: coin.ticker,
        price: `$${coin.price_usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        change: `${coin.change_24h > 0 ? '+' : ''}${coin.change_24h}%`,
        changePositive: coin.change_24h > 0,
        ticker: coin.ticker,
        logo_url: coin.logo_url && coin.logo_url.trim() !== '' ? coin.logo_url : 'https://via.placeholder.com/40',
        chartData: {
          labels: ['1', '2', '3', '4', '5', '6', '7'],
          datasets: [
            {
              data: chartDataPoints,
              borderColor: coin.change_24h >= 0 ? '#34c759' : '#ff3b30',
              backgroundColor: coin.change_24h >= 0 ? 'rgba(52, 199, 89, 0.3)' : 'rgba(255, 59, 48, 0.3)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
            },
          ],
        },
      };
    });

    const dataByCategory = {};

    dataByCategory['Popular'] = allCoinsFormatted.slice(0, 7).map((coin, idx) => ({
      ...coin,
      id: idx + 1,
    }));

    categories.forEach((category) => {
      if (category === 'Popular') return;
      const tickers = categoryTickers[category] || [];
      const categoryCoins = allCoinsFormatted.filter(coin => tickers.includes(coin.ticker)).slice(0, 7);
      dataByCategory[category] = categoryCoins.map((coin, idx) => ({
        ...coin,
        id: idx + 1,
      }));
    });

    setCryptoDataByCategory(dataByCategory);
  } catch (error) {
    console.error('Error fetching home data:', error);
    setPopularCryptos([]);
    setCryptoDataByCategory({});
  } finally {
    setIsLoading(false);
  }
}, 1000);

export default {
  getMarketCoins,
  fetchHomeData,
};