import axios from 'axios';

// Use environment variable or default to your deployed backend
const baseURL = import.meta.env.VITE_API_BASE || 'https://placement-backend-chi.vercel.app/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Add timeout
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me')
};

export const experienceAPI = {
  getAll: () => api.get('/experiences'),
  getById: (id) => api.get(`/experiences/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/experiences', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/experiences', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/experiences/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/experiences/${id}`, data);
  },
  delete: (id) => api.delete(`/experiences/${id}`)
};

export const offCampusAPI = {
  getAll: () => api.get('/offcampus'),
  create: (data) => api.post('/offcampus', data),
  delete: (id) => api.delete(`/offcampus/${id}`)
};

export default api;