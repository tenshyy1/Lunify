import api from './api';

export const fetchUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching users');
  }
};

export const banUser = async (userId) => {
  try {
    await api.post(`/admin/users/${userId}/ban`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error banning user');
  }
};

export const unbanUser = async (userId) => {
  try {
    await api.post(`/admin/users/${userId}/unban`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error unbanning user');
  }
};

export const deleteUser = async (userId) => {
  try {
    await api.delete(`/admin/users/${userId}`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting user');
  }
};