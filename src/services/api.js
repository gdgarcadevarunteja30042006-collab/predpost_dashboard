import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthCheck = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Health check failed');
  }
};

export const predictMachineHealth = async (sensorData) => {
  try {
    const response = await api.post('/predict', sensorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Prediction failed');
  }
};

export const getSensorData = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/sensor-data', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch sensor data');
  }
};

export default api;
