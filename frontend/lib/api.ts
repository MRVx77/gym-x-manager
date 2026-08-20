import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: process.env.BACK_END_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
