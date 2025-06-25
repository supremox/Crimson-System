import axios from "axios";
import { getToken } from "./getToken";
import { refreshToken } from "./refreshToken";
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  // withCredentials: true, // Optional if using cookies
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken();

  config.headers.Authorization = `Bearer ${token}` 
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
