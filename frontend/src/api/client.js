import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Interceptor to add JWT authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careertech_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized / expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      if (localStorage.getItem('careertech_token')) {
        localStorage.removeItem('careertech_token');
        localStorage.removeItem('careertech_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
