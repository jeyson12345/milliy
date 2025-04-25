import axios from "axios";

const api = axios.create({
  baseURL: "http://137.184.119.32:3000/admin",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const getUsers = async (params) => {
  const response = await api.get("/users", { params });
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const toggleUserBlock = async (userId) => {
  const response = await api.post(`/users/${userId}/toggle-block`);
  return response.data;
};

export const generateQRCode = async (validityHours, title) => {
  const response = await api.post("/qr-codes", { validityHours, title });
  return response.data;
};

export const getQRCodes = async () => {
  const response = await api.get("/qr-codes");
  return response.data;
};

export const deactivateQRCode = async (id) => {
  const response = await api.post(`/qr-codes/${id}/deactivate`);
  return response.data;
};

export const downloadQRCode = async (id) => {
  const response = await api.get(`/qr-codes/${id}/download`, {
    responseType: "blob",
  });
  return response.data;
};

export const getStatistics = async () => {
  const response = await api.get("/statistics");
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get("/top-users");
  return response.data;
};

export const getMessages = async () => {
  const response = await api.get("/messages");
  return response;
};

export const sendMessageToAllUser = async (message) => {
  const response = await api.post("send-message-to-all", { message });
  return response;
};

export const blockUser = async (userId) => {
  const response = await api.post(`/ban-user`, { userId });
  return response.data;
};

export const sendMessageToUser = async (userId, message) => {
  const response = await api.post(`/send-message-to-user`, { userId, message });
  return response.data;
};

export const getWinners = async () => {
  const response = await api.get("/get-winners");
  return response.data;
};

export const finishCompetition = async () => {
  const response = await api.post("/end-active-period");
  return response.data;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
