import api from "./api";

export const parentService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/parents?${queryString}` : "/parents";
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/parents/${id}`);
    return response.data;
  },

  create: async (parentData) => {
    const response = await api.post("/parents", parentData);
    return response.data;
  },

  update: async (id, parentData) => {
    const response = await api.put(`/parents/${id}`, parentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/parents/${id}`);
    return response.data;
  },
};
