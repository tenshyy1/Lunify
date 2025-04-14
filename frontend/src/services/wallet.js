import axios from 'axios';

const API_URL = 'http://localhost:8099';

const walletApi = {
  getPortfolios: async () => {
    const response = await axios.get(`${API_URL}/portfolios`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
  createPortfolio: async (portfolioData) => {
    const response = await axios.post(`${API_URL}/portfolios`, portfolioData, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
  deletePortfolio: async (portfolioId) => {
    const response = await axios.delete(`${API_URL}/portfolios/${portfolioId}`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
  getPortfolioCoins: async (portfolioId) => {
    const response = await axios.get(`${API_URL}/portfolios/${portfolioId}/coins`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
  addPortfolioCoin: async (portfolioId, coinData) => {
    const response = await axios.post(`${API_URL}/portfolios/${portfolioId}/coins`, coinData, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
  sellPortfolioCoin: async (portfolioId, coinData) => {
    const response = await axios.post(`${API_URL}/portfolios/${portfolioId}/coins/sell`, coinData, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
};

export default walletApi;