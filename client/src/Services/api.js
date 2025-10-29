import axios from "axios";

// Use /api prefix which will be proxied to localhost:5555 by Vite
// This eliminates cross-origin issues with session cookies
const DEFAULT_BASE = "/api";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies with every request
});

const Api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

export { BASE_URL };
export default Api;
