import { useState } from "react";
import {
  teachers,
  classes,
  studentsData,
  feeStructure,
  eventsData,
} from "../../services/mockData";

const Reports = () => {
  const [reportType, setReportType] = useState("students");
  const [dateRange, setDateRange] = useState("this-month");

  const studentData = [
    { name: "Grade 9-A", total: 35, male: 18, female: 17 },
    { name: "Grade 9-B", total: 32, male: 15, female: 17 },
    { name: "Grade 10-A", total: 38, male: 20, female: 18 },
    { name: "Grade 10-B", total: 30, male: 14, female: 16 },
    { name: "Grade 11-A", total: 28, male: 12, female: 16 },
    { name: "Grade 12-A", total: 25, male: 10, female: 15 },
  ];

  const feeReport = [
    { month: "January", collected: 125000, pending: 15000, overdue: 5000 },
    { month: "February", collected: 145000, pending: 8000, overdue: 2000 },
    { month: "March", collected: 132000, pending: 12000, overdue: 6000 },
    { month: "April", collected: 156000, pending: 5000, overdue: 1000 },
    { month: "May", collected: 148000, pending: 9000, overdue: 3000 },
    { month: "June", collected: 162000, pending: 4000, overdue: 0 },
  ];

  const attendanceReport = [
    { class: "Grade 9-A", present: 95, absent: 3, leave: 2 },
    { class: "Grade 9-B", present: 92, absent: 5, leave: 3 },
    { class: "Grade 10-A", present: 94, absent: 4, leave: 2 },
    { class: "Grade 10-B", present: 89, absent: 8, leave: 3 },
    { class: "Grade 11-A", present: 91, absent: 6, leave: 3 },
    { class: "Grade 12-A", present: 93, absent: 4, leave: 3 },
  ];

  const generatePDF = () => {
    alert(
      "Generating PDF report... This feature would generate a downloadable PDF.",
    );
  };

  const exportCSV = () => {
    alert("Exporting CSV... This feature would export data to CSV format.");
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Generate and view school performance reports</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={exportCSV} className="btn btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={generatePDF} className="btn btn-primary">
            📄 Generate PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label className="form-label">Report Type</label>
              <select
                className="form-control"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="students">Student Report</option>
                <option value="attendance">Attendance Report</option>
                <option value="fees">Fee Collection Report</option>
                <option value="teachers">Teacher Report</option>
                <option value="performance">Academic Performance</option>
              </select>
            </div>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label className="form-label">Date Range</label>
              <select
                className="form-control"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-term">This Term</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe" }}>
            👨‍🎓
          </div>
          <div className="stat-content">
            <h3>{studentData.reduce((sum, s) => sum + s.total, 0)}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7" }}>
            👨‍🏫
          </div>
          <div className="stat-content">
            <h3>{teachers.length}</h3>
            <p>Total Teachers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7" }}>
            💰
          </div>
          <div className="stat-content">
            <h3>
              ₹
              {feeReport
                .reduce((sum, f) => sum + f.collected, 0)
                .toLocaleString()}
            </h3>
            <p>Total Collected</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>
            📊
          </div>
          <div className="stat-content">
            <h3>
              {Math.round(
                attendanceReport.reduce((sum, a) => sum + a.present, 0) /
                  attendanceReport.length,
              )}
              %
            </h3>
            <p>Avg. Attendance</p>
          </div>
        </div>
      </div>

      {/* Report Tables */}
      {reportType === "students" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Student Distribution Report</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Total Students
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Male
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Female
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentData.map((student, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: "500" }}>
                      {student.name}
                    </td>
                    <td style={{ padding: "14px 16px" }}>{student.total}</td>
                    <td style={{ padding: "14px 16px" }}>{student.male}</td>
                    <td style={{ padding: "14px 16px" }}>{student.female}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: "8px",
                            backgroundColor: "var(--border-color)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${(student.total / 40) * 100}%`,
                              height: "100%",
                              backgroundColor: "var(--primary)",
                              borderRadius: "4px",
                            }}
                          ></div>
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {Math.round((student.total / 40) * 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "fees" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Fee Collection Report</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Month
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Collected
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Pending
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Overdue
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeReport.map((fee, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: "500" }}>
                      {fee.month}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#10b981",
                        fontWeight: "600",
                      }}
                    >
                      ₹{fee.collected.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#f59e0b" }}>
                      ₹{fee.pending.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#ef4444" }}>
                      ₹{fee.overdue.toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor:
                            fee.overdue === 0 ? "#dcfce7" : "#fef3c7",
                          color: fee.overdue === 0 ? "#10b981" : "#f59e0b",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {fee.overdue === 0 ? "Complete" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "attendance" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Attendance Report by Class</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Class
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Present %
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Absent %
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Leave %
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceReport.map((att, index) => (
                  <tr
                    key={index}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: "500" }}>
                      {att.class}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#10b981",
                        fontWeight: "600",
                      }}
                    >
                      {att.present}%
                    </td>
                    <td style={{ padding: "14px 16px", color: "#ef4444" }}>
                      {att.absent}%
                    </td>
                    <td style={{ padding: "14px 16px", color: "#f59e0b" }}>
                      {att.leave}%
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor:
                            att.present >= 90 ? "#dcfce7" : "#fef3c7",
                          color: att.present >= 90 ? "#10b981" : "#f59e0b",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {att.present >= 90 ? "Excellent" : "Needs Improvement"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "teachers" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Teacher Distribution Report</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Subject
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Teachers
                  </th>
                  <th
                    style={{
                      padding: "14px 16px",
                      textAlign: "left",
                      borderBottom: "2px solid var(--border-color)",
                    }}
                  >
                    Classes Handled
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>Mathematics</td>
                  <td style={{ padding: "14px 16px" }}>4</td>
                  <td style={{ padding: "14px 16px" }}>6</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>Science</td>
                  <td style={{ padding: "14px 16px" }}>3</td>
                  <td style={{ padding: "14px 16px" }}>5</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>English</td>
                  <td style={{ padding: "14px 16px" }}>3</td>
                  <td style={{ padding: "14px 16px" }}>5</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>History</td>
                  <td style={{ padding: "14px 16px" }}>2</td>
                  <td style={{ padding: "14px 16px" }}>4</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "14px 16px" }}>Art</td>
                  <td style={{ padding: "14px 16px" }}>2</td>
                  <td style={{ padding: "14px 16px" }}>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
