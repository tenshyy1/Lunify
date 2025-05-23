import api from './api';

export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const updateAvatar = async (formData) => {
  try {
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update avatar error:', error);
    throw new Error(error.response?.data?.message || 'Failed to update avatar');
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/profile/change-password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

// Use avatar
export const handleAvatarUpload = async (file, callback) => {
  if (!file) {
    throw new Error('No file selected');
  }

  const formData = new FormData();
  formData.append('avatar', file);

  const data = await updateAvatar(formData);
  const API_URL = 'http://localhost:8099';
  const newAvatarUrl = `${API_URL}${data.avatar_url}`;
  callback(newAvatarUrl);
  return newAvatarUrl;
};