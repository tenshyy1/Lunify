import api from './api';

export default {
  getPortfolios: async () => {
    try {
      const response = await api.get('/portfolios');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch portfolios');
    }
  },

  createPortfolio: async (portfolioData) => {
    try {
      const response = await api.post('/portfolios', portfolioData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create portfolio');
    }
  },

  deletePortfolio: async (portfolioId) => {
    try {
      const response = await api.delete(`/portfolios/${portfolioId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete portfolio');
    }
  },

  getPortfolioCoins: async (portfolioId) => {
    try {
      const response = await api.get(`/portfolios/${portfolioId}/coins`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch portfolio coins');
    }
  },

  addPortfolioCoin: async (portfolioId, coinData) => {
    try {
      const response = await api.post(`/portfolios/${portfolioId}/coins`, coinData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add coin to portfolio');
    }
  },

  sellPortfolioCoin: async (portfolioId, coinData) => {
    try {
      const response = await api.post(`/portfolios/${portfolioId}/coins/sell`, coinData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to sell coin from portfolio');
    }
  },
};