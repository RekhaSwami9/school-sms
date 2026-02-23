import api from "./api";

const classService = {
  // Get all classes
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.grade) params.append("grade", filters.grade);
      if (filters.academicYear)
        params.append("academicYear", filters.academicYear);
      if (filters.search) params.append("search", filters.search);

      const queryString = params.toString();
      const url = queryString ? `/classes?${queryString}` : "/classes";

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
  },

  // Get single class
  getById: async (id) => {
    try {
      const response = await api.get(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching class:", error);
      throw error;
    }
  },

  // Create new class
  create: async (classData) => {
    try {
      const response = await api.post("/classes", classData);
      return response.data;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  },

  // Update class
  update: async (id, classData) => {
    try {
      const response = await api.put(`/classes/${id}`, classData);
      return response.data;
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  },

  // Delete class
  delete: async (id) => {
    try {
      const response = await api.delete(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  },
};

export default classService;
