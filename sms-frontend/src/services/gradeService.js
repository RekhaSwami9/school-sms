import api from "./api";

const gradeService = {
  // Create or update a grade
  createOrUpdateGrade: async (gradeData) => {
    try {
      const response = await api.post("/grades", gradeData);
      return response.data;
    } catch (error) {
      console.error("Error creating/updating grade:", error);
      throw error;
    }
  },

  // Bulk create grades
  bulkCreateGrades: async (grades) => {
    try {
      const response = await api.post("/grades/bulk", { grades });
      return response.data;
    } catch (error) {
      console.error("Error in bulk grades:", error);
      throw error;
    }
  },

  // Get all grades with filters
  getAllGrades: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `/grades?${queryString}` : "/grades";
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching grades:", error);
      throw error;
    }
  },

  // Get grades for a student
  getStudentGrades: async (studentId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/grades/student/${studentId}?${queryString}`
        : `/grades/student/${studentId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching student grades:", error);
      throw error;
    }
  },

  // Get grades for a class
  getClassGrades: async (classId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString
        ? `/grades/class/${classId}?${queryString}`
        : `/grades/class/${classId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching class grades:", error);
      throw error;
    }
  },

  // Get grade by ID
  getGradeById: async (id) => {
    try {
      const response = await api.get(`/grades/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grade:", error);
      throw error;
    }
  },

  // Update grade
  updateGrade: async (id, gradeData) => {
    try {
      const response = await api.put(`/grades/${id}`, gradeData);
      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  },

  // Delete grade
  deleteGrade: async (id) => {
    try {
      const response = await api.delete(`/grades/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting grade:", error);
      throw error;
    }
  },
};

export default gradeService;
