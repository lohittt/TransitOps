import api from './axios';

export const dashboardApi = {
  get: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  // Adding standard functions to follow template
  getAll: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/dashboard/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/dashboard', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/dashboard/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/dashboard/${id}`);
    return response.data;
  }
};

export default dashboardApi;
