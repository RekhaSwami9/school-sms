import api from "./api";

const searchService = {
  // Global search across all entities
  globalSearch: async (query) => {
    try {
      const response = await api.get(
        `/search?query=${encodeURIComponent(query)}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error in global search:", error);
      throw error;
    }
  },

  // Search students with filters
  searchStudents: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/students/search?${queryString}`
        : "/students/search";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  },

  // Search teachers with filters
  searchTeachers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/teachers/search?${queryString}`
        : "/teachers/search";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching teachers:", error);
      throw error;
    }
  },

  // Search classes with filters
  searchClasses: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/classes/search?${queryString}`
        : "/classes/search";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching classes:", error);
      throw error;
    }
  },
};

export default searchService;
