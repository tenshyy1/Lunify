import axios from 'axios';

const API_URL = 'http://localhost:8099';

const marketApi = {
  getMarketCoins: async (category) => {
    const response = await axios.get(`${API_URL}/market/coins`, {
      params: { category },
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
  getTopGainers: async () => {
    const response = await axios.get(`${API_URL}/market/top-gainers`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    return response.data;
  },
};

export default marketApi;