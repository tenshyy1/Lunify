import api from './api';

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.post('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete all notifications');
  }
};