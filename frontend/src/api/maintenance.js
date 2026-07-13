import api from './axios';

export const maintenanceApi = {
  getAll: async () => {
    const response = await api.get('/maintenance');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/maintenance', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/maintenance/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data;
  },
  closeMaintenance: async (id, finalCost) => {
    const response = await api.put(`/maintenance/${id}/close`, { finalCost });
    return response.data;
  }
};

export default maintenanceApi;
