import api from './axios';

export const tripApi = {
  getAll: async () => {
    const response = await api.get('/trips');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/trips', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },
  dispatchTrip: async (id) => {
    const response = await api.put(`/trips/${id}/dispatch`);
    return response.data;
  },
  completeTrip: async (id, data) => {
    const response = await api.put(`/trips/${id}/complete`, data); // data includes odometerEnd, fuelConsumed
    return response.data;
  },
  cancelTrip: async (id) => {
    const response = await api.put(`/trips/${id}/cancel`);
    return response.data;
  }
};

export default tripApi;
