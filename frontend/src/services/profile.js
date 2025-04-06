const API_URL = "http://localhost:8099";

export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Authorization": token,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch profile");
    }
    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
};

export const updateProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update profile");
    }
    return data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

export const updateAvatar = async (token, formData) => {
  try {
    const response = await fetch(`${API_URL}/profile/avatar`, {
      method: "POST",
      headers: {
        "Authorization": token,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update avatar");
    }
    return data;
  } catch (error) {
    console.error("Update avatar error:", error);
    throw error;
  }
};

// use avatar
export const handleAvatarUpload = async (token, file, callback) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const data = await updateAvatar(token, formData);
  const newAvatarUrl = `${API_URL}${data.avatar_url}`;
  callback(newAvatarUrl); // new url
  return newAvatarUrl;
};