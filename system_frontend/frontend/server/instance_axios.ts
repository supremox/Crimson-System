import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true, // Important for sending cookies
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and not already trying to refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint (cookie will be sent automatically)
        const refreshResponse = await axiosInstance.post("/user/refresh/");
        const newAccessToken = refreshResponse.data.access;

        // Save new access token (if you store it in memory or localStorage)
        localStorage.setItem("access_token", newAccessToken);

        // Set new Authorization header and retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., logout user)
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;