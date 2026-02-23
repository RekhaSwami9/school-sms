import { useState } from "react";
import { subjects, teachers } from "../../services/mockData";

const SubjectList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);

  const filteredSubjects = subjects.filter((subject) => {
    return (
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? teacher.name : "Not Assigned";
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
  };

  const closeDetail = () => {
    setSelectedSubject(null);
  };

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
          <div className="stat-card-value">{subjects.length}</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Core Subjects</span>
            <div className="stat-card-icon">⭐</div>
          </div>
          <div className="stat-card-value">12</div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">Electives</span>
            <div className="stat-card-icon">🎯</div>
          </div>
          <div className="stat-card-value">8</div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Avg Credits</span>
            <div className="stat-card-icon">📊</div>
          </div>
          <div className="stat-card-value">
            {(
              subjects.reduce((sum, s) => sum + s.credits, 0) / subjects.length
            ).toFixed(1)}
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
            <button className="btn btn-primary">
              <span>+</span> Add Subject
            </button>
          </div>
        </div>
      </div>

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
            <button onClick={closeDetail} className="btn btn-sm btn-secondary">
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
                <p style={{ margin: 0, fontWeight: "600", fontSize: "18px" }}>
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
                <p style={{ margin: 0, fontWeight: "600", fontSize: "18px" }}>
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
                <span className="badge badge-success">Active</span>
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
                {selectedSubject.description}
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
                    background: "var(--primary-lighter)",
                    color: "var(--primary)",
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
                {subject.description.substring(0, 80)}...
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
    </div>
  );
};

export default SubjectList;
