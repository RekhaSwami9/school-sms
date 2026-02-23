import api from "./api";

const teacherService = {
  // Get all teachers
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.employmentType)
        params.append("employmentType", filters.employmentType);
      if (filters.search) params.append("search", filters.search);

      const queryString = params.toString();
      const url = queryString ? `/teachers?${queryString}` : "/teachers";

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      throw error;
    }
  },

  // Get single teacher
  getById: async (id) => {
    try {
      const response = await api.get(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher:", error);
      throw error;
    }
  },

  // Create new teacher
  create: async (teacherData) => {
    try {
      const response = await api.post("/teachers", teacherData);
      return response.data;
    } catch (error) {
      console.error("Error creating teacher:", error);
      throw error;
    }
  },

  // Update teacher
  update: async (id, teacherData) => {
    try {
      const response = await api.put(`/teachers/${id}`, teacherData);
      return response.data;
    } catch (error) {
      console.error("Error updating teacher:", error);
      throw error;
    }
  },

  // Delete teacher
  delete: async (id) => {
    try {
      const response = await api.delete(`/teachers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting teacher:", error);
      throw error;
    }
  },
};

export default teacherService;
