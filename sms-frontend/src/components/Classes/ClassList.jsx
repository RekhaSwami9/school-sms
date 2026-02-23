import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classService from "../../services/classService";
import { useToast } from "../../context/ToastContext";

const ClassList = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const gradeOptions = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
  ];

  const statusOptions = ["Active", "Inactive", "Graduated"];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedGrade) filters.grade = selectedGrade;
      if (selectedStatus) filters.status = selectedStatus;
      if (searchTerm) filters.search = searchTerm;

      const response = await classService.getAll(filters);
      if (response.success) {
        setClasses(response.classes);
      }
    } catch (error) {
      showToast("Failed to fetch classes", "error");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClasses();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedGrade, selectedStatus]);

  const handleAddClass = () => {
    navigate("/classes/new");
  };

  const handleEditClass = (id) => {
    navigate(`/classes/edit/${id}`);
  };

  const handleDeleteClick = (classItem) => {
    setDeleteConfirm(classItem);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await classService.delete(deleteConfirm.id);
      showToast("Class deleted successfully!", "success");
      fetchClasses();
    } catch (error) {
      showToast("Failed to delete class", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const getOccupancyColor = (students, capacity) => {
    const percentage = (students / capacity) * 100;
    if (percentage >= 90) return "#ef4444";
    if (percentage >= 75) return "#f59e0b";
    return "#10b981";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#10b981";
      case "Inactive":
        return "#ef4444";
      case "Graduated":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const totalStudents = classes.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalCapacity = classes.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const avgClassSize =
    classes.length > 0 ? Math.round(totalStudents / classes.length) : 0;
  const overallOccupancy =
    totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Classes</h1>
        </div>
        <div className="card-modern">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <div className="loading-spinner"></div>
            <p>Loading classes...</p>
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
          <h1>Classes</h1>
          <p>Manage classes, sections, and classroom assignments</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddClass}>
          <span style={{ marginRight: "8px" }}>+</span>
          Add Class
        </button>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Classes</span>
            <div className="stat-card-icon">🏫</div>
          </div>
          <div className="stat-card-value">{classes.length}</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Students</span>
            <div className="stat-card-icon">👨‍🎓</div>
          </div>
          <div className="stat-card-value">{totalStudents}</div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">Avg Class Size</span>
            <div className="stat-card-icon">📊</div>
          </div>
          <div className="stat-card-value">{avgClassSize}</div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Capacity</span>
            <div className="stat-card-icon">🪑</div>
          </div>
          <div className="stat-card-value">{overallOccupancy}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "end",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: "1", minWidth: "250px" }}>
              <label className="form-label">Search Classes</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by grade, section, or room..."
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
              <label className="form-label">Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="form-control"
              >
                <option value="">All Grades</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ minWidth: "150px" }}>
              <label className="form-label">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-control"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-secondary" onClick={fetchClasses}>
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
              Are you sure you want to delete "{deleteConfirm.grade} - Section{" "}
              {deleteConfirm.section}"? This action cannot be undone.
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

      {/* Classes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {classes.map((classItem) => {
          const occupancyPercent =
            ((classItem.students || 0) / (classItem.capacity || 1)) * 100;
          return (
            <div
              key={classItem.id}
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
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "20px",
                        fontWeight: "700",
                      }}
                    >
                      {classItem.grade}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Section {classItem.section}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <span
                      style={{
                        background: "var(--primary-lighter)",
                        color: "var(--primary)",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Room {classItem.room || "N/A"}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        backgroundColor:
                          getStatusColor(classItem.status) + "20",
                        color: getStatusColor(classItem.status),
                        fontWeight: "600",
                      }}
                    >
                      {classItem.status}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "13px",
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      Occupancy
                    </span>
                    <span
                      style={{
                        fontWeight: "600",
                        color: getOccupancyColor(
                          classItem.students || 0,
                          classItem.capacity || 1,
                        ),
                      }}
                    >
                      {occupancyPercent.toFixed(0)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "8px",
                      background: "#e2e8f0",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(occupancyPercent, 100)}%`,
                        background: getOccupancyColor(
                          classItem.students || 0,
                          classItem.capacity || 1,
                        ),
                        borderRadius: "4px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "8px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>{classItem.students || 0} students</span>
                    <span>Capacity: {classItem.capacity || 0}</span>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "13px",
                      marginBottom: "12px",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>👨‍🏫</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {classItem.classTeacher?.name || "No teacher assigned"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ flex: 1 }}
                      onClick={() => handleEditClass(classItem.id)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ flex: 1, color: "var(--danger)" }}
                      onClick={() => handleDeleteClick(classItem)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {classes.length === 0 && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p style={{ color: "var(--text-secondary)" }}>
            No classes found matching your criteria
          </p>
          <button
            className="btn btn-primary"
            onClick={handleAddClass}
            style={{ marginTop: "16px" }}
          >
            Add Your First Class
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassList;
