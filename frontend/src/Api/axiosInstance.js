import axios from 'axios';
import React from 'react';
import CONFIG from './config';
import { handleApiError } from '../compoenents/shared/ErrorHandler';

const axiosInstance = axios.create({
  baseURL: CONFIG.BACKEND_URL,
  withCredentials: true,
});

// request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if(originalRequest.url.includes('/token/refresh/')){
      handleApiError(error);
      console.log(error)
      window.location.href='/';
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosInstance.post(
          `/token/refresh/`,
          {}, // No body needed; backend reads from cookie
          { withCredentials: true }
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        handleApiError(refreshError);
        console.log(refreshError)
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;