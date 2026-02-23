import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import teacherService from "../../services/teacherService";
import { useToast } from "../../context/ToastContext";

const TeacherList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedEmploymentType, setSelectedEmploymentType] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const employmentTypes = ["Full-time", "Part-time", "Contract"];
  const statusOptions = ["Active", "Inactive", "On Leave"];

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedStatus) filters.status = selectedStatus;
      if (selectedEmploymentType)
        filters.employmentType = selectedEmploymentType;
      if (searchTerm) filters.search = searchTerm;

      const response = await teacherService.getAll(filters);
      if (response.success) {
        setTeachers(response.teachers);
      }
    } catch (error) {
      showToast("Failed to fetch teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeachers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, selectedEmploymentType]);

  const handleAddTeacher = () => {
    navigate("/teachers/new");
  };

  const handleEditTeacher = (id) => {
    navigate(`/teachers/edit/${id}`);
  };

  const handleDeleteClick = (teacher) => {
    setDeleteConfirm(teacher);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await teacherService.delete(deleteConfirm.id);
      showToast("Teacher deleted successfully!", "success");
      fetchTeachers();
    } catch (error) {
      showToast("Failed to delete teacher", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Inactive":
        return "#ef4444";
      case "On Leave":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getEmploymentTypeColor = (type) => {
    switch (type) {
      case "Full-time":
        return "#3b82f6";
      case "Part-time":
        return "#8b5cf6";
      case "Contract":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Teachers</h1>
        </div>
        <div className="card-modern">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <div className="loading-spinner"></div>
            <p>Loading teachers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Teachers</h1>
          <p>Manage teaching staff and faculty information</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddTeacher}>
          <span style={{ marginRight: "8px" }}>+</span>
          Add Teacher
        </button>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Teachers</span>
            <div className="stat-card-icon">👨‍🏫</div>
          </div>
          <div className="stat-card-value">{teachers.length}</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Full-time</span>
            <div className="stat-card-icon">💼</div>
          </div>
          <div className="stat-card-value">
            {teachers.filter((t) => t.employmentType === "Full-time").length}
          </div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">Part-time</span>
            <div className="stat-card-icon">⏰</div>
          </div>
          <div className="stat-card-value">
            {teachers.filter((t) => t.employmentType === "Part-time").length}
          </div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Avg Experience</span>
            <div className="stat-card-icon">📊</div>
          </div>
          <div className="stat-card-value">
            {teachers.length > 0
              ? Math.round(
                  teachers.reduce((sum, t) => sum + (t.experience || 0), 0) /
                    teachers.length,
                )
              : 0}
            y
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "end",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px" }}>
              <label className="form-label">Search Teachers</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by name, email, or qualification..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: "44px" }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "16px",
                    opacity: 0.5,
                  }}
                >
                  🔍
                </span>
              </div>
            </div>
            <div style={{ minWidth: "150px" }}>
              <label className="form-label">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-control"
              >
                <option value="">All Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ minWidth: "150px" }}>
              <label className="form-label">Employment Type</label>
              <select
                value={selectedEmploymentType}
                onChange={(e) => setSelectedEmploymentType(e.target.value)}
                className="form-control"
              >
                <option value="">All Types</option>
                {employmentTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-secondary" onClick={fetchTeachers}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Confirm Delete</h3>
            <p style={{ marginBottom: "24px", color: "var(--text-secondary)" }}>
              Are you sure you want to delete "{deleteConfirm.name}"? This
              action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                style={{ backgroundColor: "var(--danger)", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teachers Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="card-modern"
            style={{ transition: "all 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "var(--shadow-lg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "var(--shadow)";
            }}
          >
            <div className="card-body">
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "24px",
                    flexShrink: 0,
                  }}
                >
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {teacher.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {teacher.qualification || "No qualification specified"}
                  </p>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        backgroundColor:
                          getEmploymentTypeColor(teacher.employmentType) + "20",
                        color: getEmploymentTypeColor(teacher.employmentType),
                        fontWeight: "600",
                      }}
                    >
                      {teacher.employmentType}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        backgroundColor: getStatusColor(teacher.status) + "20",
                        color: getStatusColor(teacher.status),
                        fontWeight: "600",
                      }}
                    >
                      {teacher.status}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>📧</span>
                  <span>{teacher.email}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>📱</span>
                  <span>{teacher.phone || "No phone number"}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>📚</span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {teacher.subjects && teacher.subjects.length > 0
                      ? teacher.subjects.join(", ")
                      : "No subjects assigned"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--text-muted)" }}>💼</span>
                  <span>{teacher.experience || 0} years experience</span>
                </div>
                {teacher.joinDate && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>📅</span>
                    <span>
                      Joined: {new Date(teacher.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => handleEditTeacher(teacher.id)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ flex: 1, color: "var(--danger)" }}
                  onClick={() => handleDeleteClick(teacher)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teachers.length === 0 && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p style={{ color: "var(--text-secondary)" }}>
            No teachers found matching your criteria
          </p>
          <button
            className="btn btn-primary"
            onClick={handleAddTeacher}
            style={{ marginTop: "16px" }}
          >
            Add Your First Teacher
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherList;
