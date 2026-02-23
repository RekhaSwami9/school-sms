import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classService from "../../services/classService";
import teacherService from "../../services/teacherService";
import { useToast } from "../../context/ToastContext";

const ClassForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    grade: "",
    section: "",
    classTeacherId: "",
    room: "",
    capacity: 30,
    students: 0,
    academicYear: "2024-2025",
    status: "Active",
  });

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [teachersLoading, setTeachersLoading] = useState(true);

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

  const sectionOptions = ["A", "B", "C", "D", "Science", "Commerce", "Arts"];
  const statusOptions = ["Active", "Inactive", "Graduated"];

  useEffect(() => {
    fetchTeachers();
    if (isEditing) {
      fetchClass();
    }
  }, [id]);

  const fetchTeachers = async () => {
    try {
      const response = await teacherService.getAll({ status: "Active" });
      if (response.success) {
        setTeachers(response.teachers);
      }
    } catch (error) {
      showToast("Failed to fetch teachers", "error");
    } finally {
      setTeachersLoading(false);
    }
  };

  const fetchClass = async () => {
    try {
      const response = await classService.getById(id);
      if (response.success) {
        const classData = response.class;
        setFormData({
          grade: classData.grade,
          section: classData.section,
          classTeacherId: classData.classTeacherId || "",
          room: classData.room || "",
          capacity: classData.capacity,
          students: classData.students,
          academicYear: classData.academicYear,
          status: classData.status,
        });
      }
    } catch (error) {
      showToast("Failed to fetch class details", "error");
      navigate("/classes");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.grade) {
      showToast("Grade is required", "error");
      return;
    }
    if (!formData.section) {
      showToast("Section is required", "error");
      return;
    }
    if (formData.capacity < 1) {
      showToast("Capacity must be at least 1", "error");
      return;
    }
    if (formData.students < 0) {
      showToast("Student count cannot be negative", "error");
      return;
    }
    if (formData.students > formData.capacity) {
      showToast("Student count cannot exceed capacity", "error");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        classTeacherId: formData.classTeacherId || null,
      };

      if (isEditing) {
        await classService.update(id, submitData);
        showToast("Class updated successfully!", "success");
      } else {
        await classService.create(submitData);
        showToast("Class created successfully!", "success");
      }
      navigate("/classes");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to save class. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/classes");
  };

  if (fetchLoading || teachersLoading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>{isEditing ? "Edit Class" : "Add Class"}</h1>
        </div>
        <div className="card-modern">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <div className="loading-spinner"></div>
            <p>Loading...</p>
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
          <h1>{isEditing ? "Edit Class" : "Add New Class"}</h1>
          <p>
            {isEditing
              ? "Update the class information below"
              : "Fill in the details to add a new class"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card-modern">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {/* Grade */}
              <div className="form-group">
                <label className="form-label" htmlFor="grade">
                  Grade <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <select
                  id="grade"
                  name="grade"
                  className="form-input"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section */}
              <div className="form-group">
                <label className="form-label" htmlFor="section">
                  Section <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <select
                  id="section"
                  name="section"
                  className="form-input"
                  value={formData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  {sectionOptions.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Teacher */}
              <div className="form-group">
                <label className="form-label" htmlFor="classTeacherId">
                  Class Teacher
                </label>
                <select
                  id="classTeacherId"
                  name="classTeacherId"
                  className="form-input"
                  value={formData.classTeacherId}
                  onChange={handleChange}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Room */}
              <div className="form-group">
                <label className="form-label" htmlFor="room">
                  Room Number
                </label>
                <input
                  type="text"
                  id="room"
                  name="room"
                  className="form-input"
                  value={formData.room}
                  onChange={handleChange}
                  placeholder="e.g., 101"
                />
              </div>

              {/* Capacity */}
              <div className="form-group">
                <label className="form-label" htmlFor="capacity">
                  Capacity <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  className="form-input"
                  value={formData.capacity}
                  onChange={handleNumberChange}
                  min="1"
                  max="100"
                  required
                />
              </div>

              {/* Students */}
              <div className="form-group">
                <label className="form-label" htmlFor="students">
                  Current Students
                </label>
                <input
                  type="number"
                  id="students"
                  name="students"
                  className="form-input"
                  value={formData.students}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>

              {/* Academic Year */}
              <div className="form-group">
                <label className="form-label" htmlFor="academicYear">
                  Academic Year{" "}
                  <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  id="academicYear"
                  name="academicYear"
                  className="form-input"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="2024-2025"
                  required
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Occupancy Bar */}
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Occupancy</label>
              <div
                style={{
                  backgroundColor: "#e5e7eb",
                  borderRadius: "8px",
                  height: "24px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min((formData.students / formData.capacity) * 100, 100)}%`,
                    backgroundColor:
                      formData.students / formData.capacity > 0.9
                        ? "#ef4444"
                        : formData.students / formData.capacity > 0.7
                          ? "#f59e0b"
                          : "#10b981",
                    height: "100%",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
              <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                {formData.students} / {formData.capacity} students (
                {Math.round((formData.students / formData.capacity) * 100)}%)
              </small>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="loading-spinner"></span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </span>
                ) : isEditing ? (
                  "Update Class"
                ) : (
                  "Add Class"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassForm;
