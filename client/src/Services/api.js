import axios from "axios";

const BASE_URL = "http://localhost:5555";

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
