import { useState, useEffect } from "react";
import classService from "../../services/classService";
import { studentService } from "../../services/studentService";
import gradeService from "../../services/gradeService";
import { useToast } from "../../context/ToastContext";

const GradeManager = () => {
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examType, setExamType] = useState("midterm");
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [viewMode, setViewMode] = useState("enter");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  // Subject options (static for now, can be fetched from API)
  const subjects = [
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Chemistry" },
    { id: 4, name: "Biology" },
    { id: 5, name: "English" },
    { id: 6, name: "History" },
    { id: 7, name: "Geography" },
    { id: 8, name: "Computer Science" },
  ];

  const examTypes = [
    { value: "quiz", label: "Quiz" },
    { value: "midterm", label: "Midterm" },
    { value: "final", label: "Final" },
    { value: "assignment", label: "Assignment" },
    { value: "project", label: "Project" },
    { value: "practical", label: "Practical" },
    { value: "oral", label: "Oral" },
  ];

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

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

  const handleLoadStudents = async () => {
    if (!selectedClass) {
      showToast("Please select a class", "warning");
      return;
    }

    try {
      setLoading(true);

      // Get class info to find the grade name
      const classInfo = classes.find((c) => c.id === parseInt(selectedClass));
      const className = classInfo ? classInfo.grade : "";

      // Fetch students for the selected class
      const studentsResponse = await studentService.getAll({
        class_name: className,
      });
      const studentsList = studentsResponse.students || [];
      setStudents(studentsList);

      // Check for existing grades
      if (selectedSubject && examType && academicYear) {
        const gradesResponse = await gradeService.getAllGrades({
          classId: selectedClass,
          subjectId: selectedSubject,
          examType,
          academicYear,
        });

        // Convert grades array to object keyed by studentId
        const gradesMap = {};
        if (gradesResponse.grades) {
          gradesResponse.grades.forEach((grade) => {
            gradesMap[grade.studentId] = grade;
          });
        }
        setGrades(gradesMap);
      }

      showToast(`Loaded ${studentsList.length} students`, "success");
    } catch (error) {
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (studentId, marks) => {
    const numMarks = parseFloat(marks) || 0;
    const grade = calculateGrade(numMarks);

    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        studentId,
        marks: numMarks,
        grade,
        subjectId: selectedSubject,
        classId: selectedClass,
        examType,
        academicYear,
        date: new Date().toISOString().split("T")[0],
      },
    }));
  };

  const calculateGrade = (marks) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C";
    if (marks >= 40) return "D";
    return "F";
  };

  const handleSaveGrades = async () => {
    if (Object.keys(grades).length === 0) {
      showToast("No grades to save", "warning");
      return;
    }

    try {
      setSaving(true);
      const gradesData = Object.values(grades).map((grade) => ({
        studentId: grade.studentId,
        subjectId: parseInt(selectedSubject),
        classId: parseInt(selectedClass),
        examType,
        marks: grade.marks,
        maxMarks: 100,
        grade: grade.grade,
        date: grade.date,
        academicYear,
      }));

      await gradeService.bulkCreateGrades(gradesData);

      showToast("Grades saved successfully!", "success");
    } catch (error) {
      showToast("Failed to save grades", "error");
    } finally {
      setSaving(false);
    }
  };

  const getClassStats = () => {
    const gradeValues = Object.values(grades);
    if (gradeValues.length === 0) return null;

    const marks = gradeValues.map((g) => g.marks);
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const average = (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(
      1,
    );
    const passCount = marks.filter((m) => m >= 40).length;
    const passPercentage = ((passCount / marks.length) * 100).toFixed(1);

    // Grade distribution
    const distribution = {
      "A+": gradeValues.filter((g) => g.grade === "A+").length,
      A: gradeValues.filter((g) => g.grade === "A").length,
      "B+": gradeValues.filter((g) => g.grade === "B+").length,
      B: gradeValues.filter((g) => g.grade === "B").length,
      C: gradeValues.filter((g) => g.grade === "C").length,
      D: gradeValues.filter((g) => g.grade === "D").length,
      F: gradeValues.filter((g) => g.grade === "F").length,
    };

    return {
      highest,
      lowest,
      average,
      passCount,
      total: marks.length,
      passPercentage,
      distribution,
    };
  };

  const stats = getClassStats();

  const getGradeBadge = (grade) => {
    const colors = {
      "A+": "#10b981",
      A: "#10b981",
      "B+": "#84cc16",
      B: "#84cc16",
      C: "#f59e0b",
      D: "#f97316",
      F: "#ef4444",
    };
    return (
      <span
        style={{
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: "700",
          backgroundColor: (colors[grade] || "#9ca3af") + "20",
          color: colors[grade] || "#9ca3af",
        }}
      >
        {grade || "-"}
      </span>
    );
  };

  const getStudentGrade = (studentId) => {
    return grades[studentId] || { marks: "", grade: "" };
  };

  const fetchReport = async () => {
    if (!selectedClass) {
      showToast("Please select a class", "warning");
      return;
    }

    try {
      setReportLoading(true);
      const response = await gradeService.getClassGrades(selectedClass, {
        academicYear,
        subjectId: selectedSubject || undefined,
      });
      setReportData(response);
    } catch (error) {
      showToast("Failed to fetch report", "error");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Grades & Results</h1>
          <p>Manage student grades and academic performance</p>
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
              <div style={{ minWidth: "150px" }}>
                <label className="form-label">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.grade} - {c.section}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: "150px" }}>
                <label className="form-label">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: "150px" }}>
                <label className="form-label">Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="form-control"
                >
                  {examTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: "150px" }}>
                <label className="form-label">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="form-control"
                >
                  <option value="2024-2025">2024-2025</option>
                  <option value="2023-2024">2023-2024</option>
                  <option value="2022-2023">2022-2023</option>
                </select>
              </div>
              <button
                onClick={handleLoadStudents}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load Students"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setViewMode("enter")}
                className={`btn ${viewMode === "enter" ? "btn-primary" : "btn-secondary"}`}
              >
                Enter Grades
              </button>
              <button
                onClick={() => {
                  setViewMode("report");
                  fetchReport();
                }}
                className={`btn ${viewMode === "report" ? "btn-primary" : "btn-secondary"}`}
              >
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "enter" && students.length > 0 && (
        <>
          {/* Stats */}
          {stats && (
            <div
              className="stats-grid"
              style={{
                gridTemplateColumns: "repeat(4, 1fr)",
                marginBottom: "24px",
              }}
            >
              <div className="stat-card-modern success">
                <div className="stat-card-header">
                  <span className="stat-card-title">Highest</span>
                  <div className="stat-card-icon">🏆</div>
                </div>
                <div
                  className="stat-card-value"
                  style={{ color: "var(--success)" }}
                >
                  {stats.highest}
                </div>
              </div>
              <div className="stat-card-modern danger">
                <div className="stat-card-header">
                  <span className="stat-card-title">Lowest</span>
                  <div className="stat-card-icon">📉</div>
                </div>
                <div
                  className="stat-card-value"
                  style={{ color: "var(--danger)" }}
                >
                  {stats.lowest}
                </div>
              </div>
              <div className="stat-card-modern info">
                <div className="stat-card-header">
                  <span className="stat-card-title">Average</span>
                  <div className="stat-card-icon">📊</div>
                </div>
                <div
                  className="stat-card-value"
                  style={{ color: "var(--info)" }}
                >
                  {stats.average}
                </div>
              </div>
              <div className="stat-card-modern warning">
                <div className="stat-card-header">
                  <span className="stat-card-title">Pass %</span>
                  <div className="stat-card-icon">✅</div>
                </div>
                <div
                  className="stat-card-value"
                  style={{ color: "var(--warning)" }}
                >
                  {stats.passPercentage}%
                </div>
              </div>
            </div>
          )}

          {/* Grade Distribution */}
          {stats && stats.distribution && (
            <div className="card-modern" style={{ marginBottom: "24px" }}>
              <div className="card-header">
                <h3 className="card-title">Grade Distribution</h3>
              </div>
              <div className="card-body">
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {Object.entries(stats.distribution).map(([grade, count]) => (
                    <div
                      key={grade}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "8px",
                      }}
                    >
                      {getGradeBadge(grade)}
                      <span style={{ fontWeight: "600" }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grades Table */}
          <div className="card-modern">
            <div className="card-header">
              <h3 className="card-title">Enter Marks</h3>
              <span style={{ color: "var(--text-secondary)" }}>
                {students.length} students | {Object.keys(grades).length} graded
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Marks (0-100)</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const studentGrade = getStudentGrade(student.id);
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
                            {student.admission_no || student.id}
                          </span>
                        </td>
                        <td style={{ fontWeight: "500" }}>
                          {student.user?.name || student.name}
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={studentGrade.marks}
                            onChange={(e) =>
                              handleMarksChange(student.id, e.target.value)
                            }
                            className="form-control"
                            style={{ width: "100px", textAlign: "center" }}
                          />
                        </td>
                        <td>{getGradeBadge(studentGrade.grade)}</td>
                        <td>
                          {studentGrade.grade && (
                            <span
                              style={{
                                fontSize: "12px",
                                fontWeight: "600",
                                color:
                                  studentGrade.grade === "F"
                                    ? "var(--danger)"
                                    : "var(--success)",
                              }}
                            >
                              {studentGrade.grade === "F"
                                ? "❌ Fail"
                                : "✅ Pass"}
                            </span>
                          )}
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
              onClick={handleSaveGrades}
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
                "💾 Save Grades"
              )}
            </button>
          </div>
        </>
      )}

      {viewMode === "report" && reportData && !reportLoading && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Class Grade Report</h3>
            <span style={{ color: "var(--text-secondary)" }}>
              {reportData.statistics?.totalGrades || 0} grades |{" "}
              {reportData.statistics?.totalStudents || 0} students
            </span>
          </div>
          <div className="card-body">
            {reportData.statistics && (
              <div
                className="stats-grid"
                style={{
                  gridTemplateColumns: "repeat(4, 1fr)",
                  marginBottom: "24px",
                }}
              >
                <div className="stat-card-modern info">
                  <div className="stat-card-header">
                    <span className="stat-card-title">Class Average</span>
                  </div>
                  <div className="stat-card-value">
                    {reportData.statistics.averageMarks}
                  </div>
                </div>
                <div className="stat-card-modern success">
                  <div className="stat-card-header">
                    <span className="stat-card-title">Total Grades</span>
                  </div>
                  <div className="stat-card-value">
                    {reportData.statistics.totalGrades}
                  </div>
                </div>
                <div className="stat-card-modern warning">
                  <div className="stat-card-header">
                    <span className="stat-card-title">Students</span>
                  </div>
                  <div className="stat-card-value">
                    {reportData.statistics.totalStudents}
                  </div>
                </div>
              </div>
            )}

            {reportData.statistics?.gradeDistribution && (
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ marginBottom: "16px" }}>Grade Distribution</h4>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {Object.entries(reportData.statistics.gradeDistribution).map(
                    ([grade, count]) => (
                      <div
                        key={grade}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 16px",
                          backgroundColor: "#f8fafc",
                          borderRadius: "8px",
                        }}
                      >
                        {getGradeBadge(grade)}
                        <span style={{ fontWeight: "600" }}>{count}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {reportData.grades && reportData.grades.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Subject</th>
                      <th>Exam Type</th>
                      <th>Marks</th>
                      <th>Grade</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.grades.slice(0, 50).map((grade) => (
                      <tr key={grade.id}>
                        <td>{grade.studentId}</td>
                        <td>
                          {subjects.find((s) => s.id === grade.subjectId)
                            ?.name || grade.subjectId}
                        </td>
                        <td style={{ textTransform: "capitalize" }}>
                          {grade.examType}
                        </td>
                        <td>
                          {grade.marks} / {grade.maxMarks}
                        </td>
                        <td>{getGradeBadge(grade.grade)}</td>
                        <td>{new Date(grade.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {students.length === 0 && viewMode === "enter" && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👆</div>
          <p style={{ color: "var(--text-secondary)" }}>
            Select a class, subject, and exam type, then click "Load Students"
            to enter grades.
          </p>
        </div>
      )}
    </div>
  );
};

export default GradeManager;
