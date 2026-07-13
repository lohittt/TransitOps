import api from './axios';

export const expenseApi = {
  getAll: async () => {
    const response = await api.get('/expenses');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/expenses', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};

export default expenseApi;
