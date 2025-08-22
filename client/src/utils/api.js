import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  get: (endpoint) => axios.get(`${API_BASE_URL}${endpoint}`),
  post: (endpoint, data) => axios.post(`${API_BASE_URL}${endpoint}`, data),
  put: (endpoint, data) => axios.put(`${API_BASE_URL}${endpoint}`, data),
  delete: (endpoint) => axios.delete(`${API_BASE_URL}${endpoint}`),
};
