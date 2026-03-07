import { useState, useEffect } from "react";
import { subjectService } from "../../services/subjectService";
import teacherService from "../../services/teacherService";
import { useToast } from "../../context/ToastContext";

const SubjectList = () => {
  const { showSuccess, showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjectsList, setSubjectsList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    description: "",
    credits: 3,
    teacherId: "",
  });

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await subjectService.getAll();
      if (data.success) {
        setSubjectsList(data.subjects || []);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      showToast("Failed to fetch subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await teacherService.getAll();
      if (data.success) {
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const filteredSubjects = subjectsList.filter((subject) => {
    return (
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subject.description &&
        subject.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getTeacherName = (teacherId) => {
    if (!teacherId) return "Not Assigned";
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : "Not Assigned";
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const closeDetail = () => {
    setSelectedSubject(null);
  };

  const handleAddSubject = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewSubject({
      name: "",
      code: "",
      description: "",
      credits: 3,
      teacherId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: name === "credits" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmitSubject = async (e) => {
    e.preventDefault();

    if (!newSubject.name || !newSubject.code) {
      showToast("Please fill in required fields", "error");
      return;
    }

    try {
      const data = await subjectService.create({
        name: newSubject.name,
        code: newSubject.code,
        description: newSubject.description,
        credits: newSubject.credits,
        teacherId: newSubject.teacherId ? parseInt(newSubject.teacherId) : null,
      });

      if (data.success) {
        showSuccess(`Subject "${newSubject.name}" added successfully!`);
        fetchSubjects();
        handleCloseModal();
      } else {
        showToast(data.error || "Failed to create subject", "error");
      }
    } catch (error) {
      console.error("Error creating subject:", error);
      showToast("Failed to create subject", "error");
    }
  };

  const activeSubjects = subjectsList.filter(
    (s) => s.status === "Active",
  ).length;
  const coreSubjects = 12; // Can be calculated from backend
  const electives = 8;

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>Subjects</h1>
        <p>Manage curriculum subjects and course materials</p>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Subjects</span>
            <div className="stat-card-icon">📚</div>
          </div>
          <div className="stat-card-value">{subjectsList.length}</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Active Subjects</span>
            <div className="stat-card-icon">⭐</div>
          </div>
          <div className="stat-card-value">{activeSubjects}</div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">Electives</span>
            <div className="stat-card-icon">🎯</div>
          </div>
          <div className="stat-card-value">{electives}</div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Avg Credits</span>
            <div className="stat-card-icon">📊</div>
          </div>
          <div className="stat-card-value">
            {subjectsList.length > 0
              ? (
                  subjectsList.reduce((sum, s) => sum + (s.credits || 0), 0) /
                  subjectsList.length
                ).toFixed(1)
              : 0}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
            <div style={{ flex: "1" }}>
              <label className="form-label">Search Subjects</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by name, code, or description..."
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
            <button className="btn btn-primary" onClick={handleAddSubject}>
              <span>+</span> Add Subject
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div className="loading-spinner" style={{ margin: "0 auto" }}></div>
          <p style={{ marginTop: "16px" }}>Loading subjects...</p>
        </div>
      ) : (
        <>
          {/* Subject Detail Panel */}
          {selectedSubject && (
            <div
              className="card-modern"
              style={{ marginBottom: "24px", backgroundColor: "#f8fafc" }}
            >
              <div className="card-header">
                <h3 className="card-title">
                  {selectedSubject.name} ({selectedSubject.code})
                </h3>
                <button
                  onClick={closeDetail}
                  className="btn btn-sm btn-secondary"
                >
                  ✕ Close
                </button>
              </div>
              <div className="card-body">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Subject Code
                    </p>
                    <p
                      style={{ margin: 0, fontWeight: "600", fontSize: "18px" }}
                    >
                      {selectedSubject.code}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Credits
                    </p>
                    <p
                      style={{ margin: 0, fontWeight: "600", fontSize: "18px" }}
                    >
                      {selectedSubject.credits}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Assigned Teacher
                    </p>
                    <p style={{ margin: 0, fontWeight: "600" }}>
                      {getTeacherName(selectedSubject.teacherId)}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: "16px",
                      background: "white",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      Status
                    </p>
                    <span
                      className={`badge ${selectedSubject.status === "Active" ? "badge-success" : "badge-warning"}`}
                    >
                      {selectedSubject.status || "Active"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>
                    Description
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                    }}
                  >
                    {selectedSubject.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Subjects Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="card-modern"
                style={{ cursor: "pointer" }}
                onClick={() => handleSubjectClick(subject)}
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
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {subject.code.substring(0, 2)}
                    </div>
                    <span
                      style={{
                        background:
                          subject.status === "Active"
                            ? "var(--success-light)"
                            : "var(--warning-light)",
                        color:
                          subject.status === "Active"
                            ? "var(--success)"
                            : "var(--warning)",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {subject.credits} Credits
                    </span>
                  </div>

                  <h3
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {subject.name}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 16px 0",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: "1.5",
                    }}
                  >
                    {subject.description
                      ? subject.description.substring(0, 80) + "..."
                      : "No description"}
                  </p>

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
                      }}
                    >
                      <span style={{ color: "var(--text-muted)" }}>👨‍🏫</span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {getTeacherName(subject.teacherId)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div
              className="card-modern"
              style={{ textAlign: "center", padding: "60px" }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ color: "var(--text-secondary)" }}>
                No subjects found matching your search
              </p>
            </div>
          )}
        </>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
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
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0 }}>Add New Subject</h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitSubject}>
              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Subject Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newSubject.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Subject Code *</label>
                <input
                  type="text"
                  name="code"
                  value={newSubject.code}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., MATH"
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newSubject.description}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter subject description"
                  rows={4}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Credits</label>
                <input
                  type="number"
                  name="credits"
                  value={newSubject.credits}
                  onChange={handleInputChange}
                  className="form-control"
                  min="1"
                  max="10"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Assigned Teacher</label>
                <select
                  name="teacherId"
                  value={newSubject.teacherId}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn btn-primary">
                  Add Subject
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectList;
