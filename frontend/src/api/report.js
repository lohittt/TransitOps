import api from './axios';

export const reportApi = {
  exportCsv: async () => {
    const response = await api.get('/reports/export/csv');
    return response.data;
  },
  exportPdf: async () => {
    const response = await api.get('/reports/export/pdf', { responseType: 'blob' });
    return response.data;
  }
};

export default reportApi;
