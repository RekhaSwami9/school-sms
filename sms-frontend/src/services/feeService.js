import api from "./api";

export const feeService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/fees?${queryString}` : "/fees";
    const response = await api.get(url);
    return response.data;
  },

  getStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/fees/stats?${queryString}` : "/fees/stats";
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/fees/${id}`);
    return response.data;
  },

  create: async (feeData) => {
    const response = await api.post("/fees", feeData);
    return response.data;
  },

  update: async (id, feeData) => {
    const response = await api.put(`/fees/${id}`, feeData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/fees/${id}`);
    return response.data;
  },

  sendReminder: async (id) => {
    const response = await api.post(`/fees/${id}/reminder`);
    return response.data;
  },
};
