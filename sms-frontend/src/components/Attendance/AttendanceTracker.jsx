import { useState, useEffect } from "react";
import classService from "../../services/classService";
import { studentService } from "../../services/studentService";
import attendanceService from "../../services/attendanceService";
import { useToast } from "../../context/ToastContext";

const AttendanceTracker = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [viewMode, setViewMode] = useState("mark"); // 'mark' or 'report'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Fetch students and attendance when class or date changes
  useEffect(() => {
    if (selectedClass && selectedDate) {
      if (viewMode === "mark") {
        fetchStudentsAndAttendance();
      } else {
        fetchAttendanceReport();
      }
    }
  }, [selectedClass, selectedDate, viewMode]);

  const fetchClasses = async () => {
    try {
      const response = await classService.getAll({ status: "Active" });
      if (response.success) {
        setClasses(response.classes);
      }
    } catch (error) {
      showToast("Failed to fetch classes", "error");
    }
  };

  const fetchStudentsAndAttendance = async () => {
    try {
      setLoading(true);

      // Get class info to find the grade name
      const classInfo = classes.find((c) => c.id === parseInt(selectedClass));
      const className = classInfo ? classInfo.grade : "";

      // Fetch students for the selected class using class_name
      const studentsResponse = await studentService.getAll({
        class_name: className,
      });
      const studentsList = studentsResponse.students || [];
      setStudents(studentsList);

      // Fetch existing attendance for the date
      const attendanceResponse = await attendanceService.getClassAttendance(
        selectedClass,
        selectedDate,
      );

      // Convert attendance array to object keyed by studentId
      const attendanceMap = {};
      if (attendanceResponse.attendance) {
        attendanceResponse.attendance.forEach((record) => {
          attendanceMap[record.studentId] = record;
        });
      }
      setAttendance(attendanceMap);
    } catch (error) {
      showToast("Failed to fetch attendance data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceReport = async () => {
    try {
      setReportLoading(true);
      const endDate = selectedDate;
      const startDate = new Date(
        new Date(endDate).setDate(new Date(endDate).getDate() - 30),
      )
        .toISOString()
        .split("T")[0];

      const response = await attendanceService.getClassAttendanceReport(
        selectedClass,
        startDate,
        endDate,
      );
      setReportData(response);
    } catch (error) {
      showToast("Failed to fetch attendance report", "error");
    } finally {
      setReportLoading(false);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setAttendance({});
    setReportData(null);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setAttendance({});
    setReportData(null);
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        status,
        date: selectedDate,
        classId: selectedClass,
      },
    }));
  };

  const handleMarkAll = (status) => {
    const newAttendance = {};
    students.forEach((student) => {
      newAttendance[student.id] = {
        studentId: student.id,
        status,
        date: selectedDate,
        classId: selectedClass,
      };
    });
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    if (Object.keys(attendance).length === 0) {
      showToast("No attendance to save", "warning");
      return;
    }

    try {
      setSaving(true);
      const attendanceData = Object.values(attendance).map((record) => ({
        studentId: record.studentId,
        status: record.status,
        remarks: record.remarks || "",
      }));

      await attendanceService.bulkMarkAttendance(
        selectedClass,
        selectedDate,
        attendanceData,
      );

      showToast("Attendance saved successfully!", "success");
      fetchStudentsAndAttendance(); // Refresh data
    } catch (error) {
      showToast("Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const getAttendanceStats = () => {
    const records = Object.values(attendance);
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const excused = records.filter((r) => r.status === "excused").length;
    const total = students.length;
    const marked = records.length;

    return {
      present,
      absent,
      late,
      excused,
      total,
      marked,
      unmarked: total - marked,
      percentage:
        total > 0 ? (((present + late + excused) / total) * 100).toFixed(1) : 0,
    };
  };

  const stats = getAttendanceStats();

  const getStatusBadge = (status) => {
    const config = {
      present: { class: "badge-success", label: "Present", color: "#10b981" },
      absent: { class: "badge-danger", label: "Absent", color: "#ef4444" },
      late: { class: "badge-warning", label: "Late", color: "#f59e0b" },
      excused: { class: "badge-info", label: "Excused", color: "#3b82f6" },
      unmarked: {
        class: "badge-secondary",
        label: "Not Marked",
        color: "#9ca3af",
      },
    };
    const configItem = config[status] || config.unmarked;
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          backgroundColor: configItem.color + "20",
          color: configItem.color,
        }}
      >
        {configItem.label}
      </span>
    );
  };

  const getStudentStatus = (studentId) => {
    return attendance[studentId]?.status || "unmarked";
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Track and manage student attendance records</p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
      >
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Present</span>
            <div className="stat-card-icon">✅</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {stats.present}
          </div>
        </div>
        <div className="stat-card-modern danger">
          <div className="stat-card-header">
            <span className="stat-card-title">Absent</span>
            <div className="stat-card-icon">❌</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            {stats.absent}
          </div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">Late</span>
            <div className="stat-card-icon">⏰</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--warning)" }}>
            {stats.late}
          </div>
        </div>
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Excused</span>
            <div className="stat-card-icon">📝</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--info)" }}>
            {stats.excused}
          </div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Attendance %</span>
            <div className="stat-card-icon">📊</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--primary)" }}>
            {stats.percentage}%
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "end",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                alignItems: "end",
              }}
            >
              <div style={{ minWidth: "200px" }}>
                <label className="form-label">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  className="form-control"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.grade} - Section {c.section}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: "150px" }}>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setViewMode("mark")}
                className={`btn ${viewMode === "mark" ? "btn-primary" : "btn-secondary"}`}
              >
                Mark Attendance
              </button>
              <button
                onClick={() => setViewMode("report")}
                className={`btn ${viewMode === "report" ? "btn-primary" : "btn-secondary"}`}
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "40px" }}
        >
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {viewMode === "mark" && selectedClass && !loading && (
        <>
          {/* Bulk Actions */}
          <div className="card-modern" style={{ marginBottom: "16px" }}>
            <div className="card-body">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "600", marginRight: "10px" }}>
                  Mark All:
                </span>
                <button
                  onClick={() => handleMarkAll("present")}
                  className="btn btn-sm btn-success"
                >
                  Present
                </button>
                <button
                  onClick={() => handleMarkAll("absent")}
                  className="btn btn-sm btn-danger"
                >
                  Absent
                </button>
                <button
                  onClick={() => handleMarkAll("late")}
                  className="btn btn-sm btn-secondary"
                  style={{ backgroundColor: "#f59e0b", color: "white" }}
                >
                  Late
                </button>
                <button
                  onClick={() => handleMarkAll("excused")}
                  className="btn btn-sm btn-secondary"
                  style={{ backgroundColor: "#3b82f6", color: "white" }}
                >
                  Excused
                </button>
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Marked: {stats.marked} / {stats.total}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="card-modern">
            <div className="card-header">
              <h3 className="card-title">Student Attendance</h3>
              <span style={{ color: "var(--text-secondary)" }}>
                {students.length} students
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const status = getStudentStatus(student.id);
                    return (
                      <tr key={student.id}>
                        <td>
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "500",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {student.rollNumber || student.id}
                          </span>
                        </td>
                        <td style={{ fontWeight: "500" }}>
                          {student.user?.name || student.name}
                        </td>
                        <td>{getStatusBadge(status)}</td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              onClick={() =>
                                handleStatusChange(student.id, "present")
                              }
                              className={`btn btn-sm ${status === "present" ? "btn-success" : "btn-secondary"}`}
                            >
                              P
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(student.id, "absent")
                              }
                              className={`btn btn-sm ${status === "absent" ? "btn-danger" : "btn-secondary"}`}
                            >
                              A
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(student.id, "late")
                              }
                              className={`btn btn-sm ${status === "late" ? "btn-secondary" : "btn-secondary"}`}
                              style={
                                status === "late"
                                  ? {
                                      backgroundColor: "#f59e0b",
                                      color: "white",
                                    }
                                  : {}
                              }
                            >
                              L
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(student.id, "excused")
                              }
                              className={`btn btn-sm ${status === "excused" ? "btn-secondary" : "btn-secondary"}`}
                              style={
                                status === "excused"
                                  ? {
                                      backgroundColor: "#3b82f6",
                                      color: "white",
                                    }
                                  : {}
                              }
                            >
                              E
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSaveAttendance}
              disabled={saving}
            >
              {saving ? (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span className="loading-spinner"></span>
                  Saving...
                </span>
              ) : (
                "💾 Save Attendance"
              )}
            </button>
          </div>
        </>
      )}

      {viewMode === "report" &&
        selectedClass &&
        !reportLoading &&
        reportData && (
          <div className="card-modern">
            <div className="card-header">
              <h3 className="card-title">Attendance Report (Last 30 Days)</h3>
            </div>
            <div className="card-body">
              {reportData.dailyStats && reportData.dailyStats.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="table-modern">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Late</th>
                        <th>Excused</th>
                        <th>Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dailyStats.map((day) => (
                        <tr key={day.date}>
                          <td>{new Date(day.date).toLocaleDateString()}</td>
                          <td>{day.total}</td>
                          <td style={{ color: "#10b981", fontWeight: "600" }}>
                            {day.present}
                          </td>
                          <td style={{ color: "#ef4444", fontWeight: "600" }}>
                            {day.absent}
                          </td>
                          <td style={{ color: "#f59e0b", fontWeight: "600" }}>
                            {day.late}
                          </td>
                          <td style={{ color: "#3b82f6", fontWeight: "600" }}>
                            {day.excused}
                          </td>
                          <td>
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                backgroundColor:
                                  day.attendanceRate >= 90
                                    ? "#10b98120"
                                    : day.attendanceRate >= 75
                                      ? "#f59e0b20"
                                      : "#ef444420",
                                color:
                                  day.attendanceRate >= 90
                                    ? "#10b981"
                                    : day.attendanceRate >= 75
                                      ? "#f59e0b"
                                      : "#ef4444",
                              }}
                            >
                              {day.attendanceRate.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p style={{ color: "var(--text-secondary)" }}>
                    No attendance records found for the selected period.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      {reportLoading && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "40px" }}
        >
          <div className="loading-spinner"></div>
          <p>Loading report...</p>
        </div>
      )}

      {!selectedClass && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👆</div>
          <p style={{ color: "var(--text-secondary)" }}>
            Please select a class to mark or view attendance.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
