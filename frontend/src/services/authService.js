import api from './api';

export const loginUser = async (login, password) => {
  try {
    const response = await api.post('/login', { login, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (login, password) => {
  try {
    const response = await api.post('/register', { login, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};