import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentService } from "../../services/studentService";
import searchService from "../../services/searchService";
import classService from "../../services/classService";
import { useToast } from "../../context/ToastContext";

const StudentList = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [classes, setClasses] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    class_name: "",
    section: "",
    gender: "",
    status: "",
    sortBy: "name",
    sortOrder: "ASC",
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await classService.getAll({ status: "Active" });
      if (response.success) {
        setClasses(response.classes);
      }
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data.students || []);
      setError(null);
      setCurrentPage(1); // Reset to first page on fetch
    } catch (err) {
      setError("Failed to fetch students");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch();
      } else if (searchTerm.trim().length === 0) {
        fetchStudents();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await searchService.searchStudents({
        query: searchTerm,
        ...filters,
      });
      setStudents(response.students || []);
      setCurrentPage(1);
    } catch (err) {
      showToast("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const response = await searchService.searchStudents({
        query: searchTerm,
        ...filters,
      });
      setStudents(response.students || []);
      setCurrentPage(1);
      showToast(`Found ${response.count} students`, "success");
    } catch (err) {
      showToast("Failed to apply filters", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      class_name: "",
      section: "",
      gender: "",
      status: "",
      sortBy: "name",
      sortOrder: "ASC",
    });
    setSearchTerm("");
    fetchStudents();
  };

  const uniqueSections = [...new Set(classes.map((c) => c.section))].sort();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(id);
        showSuccess("Student deleted successfully!");
        fetchStudents();
      } catch (err) {
        console.error("Failed to delete student:", err);
        showError(
          "Failed to delete student: " +
            (err.response?.data?.error || err.message),
        );
      }
    }
  };

  const handleView = (student) => {
    alert(
      `Student Details:\n\nName: ${student.user?.name}\nEmail: ${student.user?.email}\nAdmission No: ${student.admission_no || "N/A"}\nClass: ${student.class_name || "N/A"} ${student.section || ""}\nGender: ${student.gender || "N/A"}\nDOB: ${student.dob ? new Date(student.dob).toLocaleDateString() : "N/A"}`,
    );
  };

  const handleEdit = (student) => {
    navigate(`/students/edit/${student.id}`);
  };

  // Export functionality
  const handleExport = () => {
    if (students.length === 0) {
      showToast("No students to export", "warning");
      return;
    }

    // Create CSV headers
    const headers = [
      "Admission No",
      "Name",
      "Email",
      "Class",
      "Section",
      "Gender",
      "DOB",
      "Status",
    ];

    // Create CSV rows
    const rows = students.map((student) => [
      student.admission_no || "",
      student.user?.name || "",
      student.user?.email || "",
      student.class_name || "",
      student.section || "",
      student.gender || "",
      student.dob ? new Date(student.dob).toLocaleDateString() : "",
      "active",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `students_export_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess(`Exported ${students.length} students successfully!`);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Client-side filtering for additional refinement
  const filteredStudents = students;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: "badge-success", label: "Active" },
      inactive: { class: "badge-danger", label: "Inactive" },
      suspended: { class: "badge-warning", label: "Suspended" },
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Students</h1>
          <p>Manage student records and information</p>
        </div>
        <div
          className="card-modern"
          style={{ padding: "60px", textAlign: "center" }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
          <p style={{ color: "var(--text-secondary)" }}>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>Students</h1>
        <p>Manage student records and information</p>
      </div>

      {/* Action Bar */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                position: "relative",
                flex: "1",
                minWidth: "280px",
                maxWidth: "400px",
              }}
            >
              <input
                type="text"
                placeholder="Search students by name, email, admission no..."
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    opacity: 0.5,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className={`btn ${showFilters ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <span>🔍</span> Filters
                {(filters.class_name ||
                  filters.section ||
                  filters.gender ||
                  filters.status) && (
                  <span
                    style={{
                      marginLeft: "6px",
                      padding: "2px 6px",
                      backgroundColor: "var(--primary)",
                      color: "white",
                      borderRadius: "10px",
                      fontSize: "11px",
                    }}
                  >
                    !
                  </span>
                )}
              </button>
              <button className="btn btn-secondary" onClick={handleExport}>
                <span>📥</span> Export
              </button>
              <Link to="/students/new" className="btn btn-primary">
                <span>+</span> Add Student
              </Link>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "var(--bg-secondary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <label className="form-label">Class</label>
                  <select
                    value={filters.class_name}
                    onChange={(e) =>
                      handleFilterChange("class_name", e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="">All Classes</option>
                    {[...new Set(classes.map((c) => c.grade))]
                      .sort()
                      .map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Section</label>
                  <select
                    value={filters.section}
                    onChange={(e) =>
                      handleFilterChange("section", e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="">All Sections</option>
                    {uniqueSections.map((section) => (
                      <option key={section} value={section}>
                        {section}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={(e) =>
                      handleFilterChange("gender", e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="name">Name</option>
                    <option value="admission_no">Admission No</option>
                    <option value="class_name">Class</option>
                    <option value="createdAt">Date Added</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Order</label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      handleFilterChange("sortOrder", e.target.value)
                    }
                    className="form-control"
                  >
                    <option value="ASC">Ascending</option>
                    <option value="DESC">Descending</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button className="btn btn-secondary" onClick={resetFilters}>
                  Reset
                </button>
                <button className="btn btn-primary" onClick={applyFilters}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="card-modern">
        <div className="card-header">
          <h3 className="card-title">
            All Students ({filteredStudents.length})
          </h3>
          {(searchTerm ||
            filters.class_name ||
            filters.section ||
            filters.gender ||
            filters.status) && (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{ fontSize: "13px", color: "var(--text-secondary)" }}
              >
                {searchTerm && `Search: "${searchTerm}"`}
                {filters.class_name && ` • Class: ${filters.class_name}`}
                {filters.section && ` • Section: ${filters.section}`}
                {filters.gender && ` • Gender: ${filters.gender}`}
                {filters.status && ` • Status: ${filters.status}`}
              </span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={resetFilters}
                style={{ padding: "4px 8px" }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: "60px" }}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                      📭
                    </div>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        marginBottom: "8px",
                      }}
                    >
                      {searchTerm
                        ? "No students found matching your search"
                        : "No students found"}
                    </p>
                    {!searchTerm && (
                      <Link
                        to="/students/new"
                        className="btn btn-primary btn-sm"
                      >
                        Add your first student
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          {student.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2) || "ST"}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: "600",
                              color: "var(--text-primary)",
                            }}
                          >
                            {student.user?.name || "N/A"}
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {student.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: "500",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {student.admission_no || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          background: "var(--primary-lighter)",
                          color: "var(--primary)",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {student.class_name || "N/A"} {student.section || ""}
                      </span>
                    </td>
                    <td>
                      <span style={{ textTransform: "capitalize" }}>
                        {student.gender || "N/A"}
                      </span>
                    </td>
                    <td>
                      {student.dob
                        ? new Date(student.dob).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>{getStatusBadge("active")}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleView(student)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: "6px 12px" }}
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(student)}
                          className="btn btn-sm btn-secondary"
                          style={{ padding: "6px 12px" }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: "6px 12px" }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <div
            className="card-body"
            style={{
              borderTop: "1px solid var(--border-color)",
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <span
                style={{ fontSize: "14px", color: "var(--text-secondary)" }}
              >
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
                {filteredStudents.length} entries
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={index}
                      style={{
                        padding: "6px 12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={index}
                      className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
