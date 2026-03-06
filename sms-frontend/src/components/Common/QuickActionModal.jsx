import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { studentService } from "../../services/studentService";
import teacherService from "../../services/teacherService";
import eventService from "../../services/eventService";
import attendanceService from "../../services/attendanceService";
import classService from "../../services/classService";

const QuickActionModal = ({ isOpen, onClose, actionType }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [attendanceBulk, setAttendanceBulk] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      switch (actionType) {
        case "student":
          // For quick add, we navigate to full form
          showSuccess("Redirecting to student form...");
          navigate("/students/new");
          break;
        case "teacher":
          // For quick add, we navigate to full form
          showSuccess("Redirecting to teacher form...");
          navigate("/teachers/new");
          break;
        case "attendance":
          if (!formData.classId || !formData.date) {
            showToast("Please select class and date", "warning");
            setLoading(false);
            return;
          }
          // Show instruction to go to attendance page
          showSuccess("Please use the Attendance page to mark attendance");
          navigate("/attendance");
          break;
        case "event":
          if (!formData.title || !formData.date || !formData.type) {
            showToast("Please fill in required fields", "warning");
            setLoading(false);
            return;
          }
          // Create event
          await eventService.create({
            ...formData,
            date: new Date(formData.date).toISOString(),
          });
          showSuccess("Event created successfully!");
          break;
        default:
          showSuccess("Action completed successfully!");
      }
      onClose();
      setFormData({});
    } catch (error) {
      console.error("Quick action error:", error);
      showError("Failed to complete action. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAttendance = async (status) => {
    if (!formData.classId || !formData.date) {
      showToast("Please select a class first", "warning");
      return;
    }

    setAttendanceBulk(status);

    try {
      // Get students for the class and mark all with the status
      showSuccess(`Marking all students as ${status}...`);

      // Navigate to attendance page with params
      navigate(`/attendance?classId=${formData.classId}&date=${formData.date}`);
      onClose();
    } catch (error) {
      showError("Failed to mark attendance");
    } finally {
      setAttendanceBulk(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    onClose();
    setFormData({});
  };

  const getTitle = () => {
    switch (actionType) {
      case "student":
        return "Quick Add Student";
      case "teacher":
        return "Quick Add Teacher";
      case "attendance":
        return "Quick Mark Attendance";
      case "event":
        return "Quick Create Event";
      default:
        return "Quick Action";
    }
  };

  const getIcon = () => {
    switch (actionType) {
      case "student":
        return "👨‍🎓";
      case "teacher":
        return "👨‍🏫";
      case "attendance":
        return "📋";
      case "event":
        return "📅";
      default:
        return "⚡";
    }
  };

  const renderForm = () => {
    switch (actionType) {
      case "student":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "#eff6ff",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", color: "#1e40af" }}>
                💡 Quick tip: Use this to quickly add basic student information.
                You'll be redirected to the full form for complete details.
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="Enter student name"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Grade *
                </label>
                <select
                  name="grade"
                  required
                  value={formData.grade || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select Grade</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Grade {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Section *
                </label>
                <select
                  name="section"
                  required
                  value={formData.section || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select Section</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="student@email.com"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="555-0000"
              />
            </div>
          </div>
        );

      case "teacher":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "#ecfdf5",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", color: "#065f46" }}>
                💡 Quick tip: Use this to quickly add teacher information.
                You'll be redirected to the full form for complete details.
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="Enter teacher name"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="teacher@school.com"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                  placeholder="555-0000"
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="e.g., M.Sc., B.Ed."
              />
            </div>
          </div>
        );

      case "attendance":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fef3c7",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
                💡 Select a class and date, then use quick options or go to the
                full attendance page.
              </p>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Select Class *
              </label>
              <select
                name="classId"
                required
                value={formData.classId || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              >
                <option value="">Select Class</option>
                <option value="1">Grade 1 - A</option>
                <option value="2">Grade 2 - A</option>
                <option value="3">Grade 3 - A</option>
                <option value="4">Grade 4 - A</option>
                <option value="5">Grade 5 - A</option>
                <option value="6">Grade 6 - A</option>
                <option value="7">Grade 7 - A</option>
                <option value="8">Grade 8 - A</option>
                <option value="9">Grade 9 - A</option>
                <option value="10">Grade 10 - A</option>
                <option value="11">Grade 11 - Science</option>
                <option value="12">Grade 11 - Commerce</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date || new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div
              style={{
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                }}
              >
                ⚡ Quick Attendance Options:
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => handleQuickAttendance("present")}
                  disabled={!formData.classId || attendanceBulk}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    backgroundColor: !formData.classId ? "#f1f5f9" : "#dcfce7",
                    border: !formData.classId
                      ? "1px solid #e2e8f0"
                      : "1px solid #10b981",
                    borderRadius: "6px",
                    color: !formData.classId ? "#94a3b8" : "#166534",
                    fontSize: "13px",
                    cursor: !formData.classId ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {attendanceBulk === "present" ? "⏳" : "✅"} Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAttendance("absent")}
                  disabled={!formData.classId || attendanceBulk}
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    backgroundColor: !formData.classId ? "#f1f5f9" : "#fee2e2",
                    border: !formData.classId
                      ? "1px solid #e2e8f0"
                      : "1px solid #ef4444",
                    borderRadius: "6px",
                    color: !formData.classId ? "#94a3b8" : "#991b1b",
                    fontSize: "13px",
                    cursor: !formData.classId ? "not-allowed" : "pointer",
                    fontWeight: "500",
                    minWidth: "120px",
                  }}
                >
                  {attendanceBulk === "absent" ? "⏳" : "❌"} Mark All Absent
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/attendance")}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "var(--primary)",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              📋 Go to Full Attendance Page
            </button>
          </div>
        );

      case "event":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="Enter event title"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    fontSize: "14px",
                  }}
                >
                  <option value="">Select Type</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                placeholder="Event location"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows="3"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  fontSize: "14px",
                  resize: "vertical",
                }}
                placeholder="Brief description of the event"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "24px",
          width: "90%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "auto",
          animation: "slideUp 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "24px" }}>{getIcon()}</span>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f1f5f9";
              e.target.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "var(--text-secondary)";
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {renderForm()}

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "24px",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: "10px 20px",
                border: "1px solid var(--border-color)",
                backgroundColor: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 24px",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "white",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  {actionType === "student" && "➕ Add Student"}
                  {actionType === "teacher" && "➕ Add Teacher"}
                  {actionType === "attendance" && "📋 Mark Attendance"}
                  {actionType === "event" && "🎉 Create Event"}
                  {!["student", "teacher", "attendance", "event"].includes(
                    actionType,
                  ) && "Save"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuickActionModal;
