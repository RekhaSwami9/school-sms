import api from "./api";

const attendanceService = {
  // Get attendance for a class on a specific date
  getClassAttendance: async (classId, date) => {
    try {
      const response = await api.get(
        `/attendance/class?classId=${classId}&date=${date}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching class attendance:", error);
      throw error;
    }
  },

  // Get attendance for a specific student
  getStudentAttendance: async (studentId, startDate, endDate) => {
    try {
      let url = `/attendance/student/${studentId}`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching student attendance:", error);
      throw error;
    }
  },

  // Mark single attendance
  markAttendance: async (attendanceData) => {
    try {
      const response = await api.post("/attendance/mark", attendanceData);
      return response.data;
    } catch (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }
  },

  // Bulk mark attendance
  bulkMarkAttendance: async (classId, date, attendanceData) => {
    try {
      const response = await api.post("/attendance/bulk", {
        classId,
        date,
        attendanceData,
      });
      return response.data;
    } catch (error) {
      console.error("Error in bulk attendance:", error);
      throw error;
    }
  },

  // Get attendance report for a class
  getClassAttendanceReport: async (classId, startDate, endDate) => {
    try {
      let url = `/attendance/report/${classId}`;
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching attendance report:", error);
      throw error;
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting attendance:", error);
      throw error;
    }
  },
};

export default attendanceService;
