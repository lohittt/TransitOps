import api from './axios';

export const fuelApi = {
  getAll: async () => {
    const response = await api.get('/fuel-logs');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/fuel-logs/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/fuel-logs', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/fuel-logs/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/fuel-logs/${id}`);
    return response.data;
  }
};

export default fuelApi;
