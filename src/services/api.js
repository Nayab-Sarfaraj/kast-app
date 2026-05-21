import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// In production, this would be your actual backend URL.
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('kast_jwt');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from SecureStore', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, clearing auth and redirecting...');
      try {
        await SecureStore.deleteItemAsync('kast_jwt');
        await SecureStore.deleteItemAsync('kast_device_id');
      } catch (e) {
        console.error('Error clearing auth', e);
      }
      router.replace('/(onboarding)');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (deviceId) => {
    const res = await api.post('/device/register', { deviceId });
    return res.data;
  },
  getCredits: async () => {
    const res = await api.get('/device/credits');
    return res.data;
  },
};

export const generationAPI = {
  generate: async (payload) => {
    const res = await api.post('/generate', payload);
    return res.data;
  },
  getJobStatus: async (jobId) => {
    const res = await api.get(`/job/${jobId}`);
    return res.data;
  },
  getHistory: async ({ pageParam = 1 }) => {
    const res = await api.get(`/history?page=${pageParam}&limit=20`);
    return res.data;
  },
};

export const metaAPI = {
  getModels: async () => {
    const res = await api.get('/models');
    return res.data;
  },
  getStyles: async () => {
    const res = await api.get('/styles');
    return res.data;
  },
};

export default api;
