import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import teacherService from "../../services/teacherService";
import { useToast } from "../../context/ToastContext";

const TeacherForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    employmentType: "Full-time",
    joinDate: "",
    subjects: [],
    status: "Active",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  const employmentTypes = ["Full-time", "Part-time", "Contract"];
  const statusOptions = ["Active", "Inactive", "On Leave"];

  useEffect(() => {
    if (isEditing) {
      fetchTeacher();
    }
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await teacherService.getById(id);
      if (response.success) {
        const teacher = response.teacher;
        setFormData({
          name: teacher.name,
          email: teacher.email,
          phone: teacher.phone || "",
          qualification: teacher.qualification || "",
          experience: teacher.experience || "",
          employmentType: teacher.employmentType,
          joinDate: teacher.joinDate || "",
          subjects: teacher.subjects || [],
          status: teacher.status,
        });
      }
    } catch (error) {
      showToast("Failed to fetch teacher details", "error");
      navigate("/teachers");
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

  const handleSubjectsChange = (e) => {
    const value = e.target.value;
    const subjects = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      subjects,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showToast("Teacher name is required", "error");
      return;
    }
    if (!formData.email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    if (!formData.email.includes("@")) {
      showToast("Please enter a valid email", "error");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        experience: parseInt(formData.experience) || 0,
      };

      if (isEditing) {
        await teacherService.update(id, submitData);
        showToast("Teacher updated successfully!", "success");
      } else {
        await teacherService.create(submitData);
        showToast("Teacher created successfully!", "success");
      }
      navigate("/teachers");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to save teacher. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/teachers");
  };

  if (fetchLoading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>{isEditing ? "Edit Teacher" : "Add Teacher"}</h1>
        </div>
        <div className="card-modern">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <div className="loading-spinner"></div>
            <p>Loading teacher details...</p>
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
          <h1>{isEditing ? "Edit Teacher" : "Add New Teacher"}</h1>
          <p>
            {isEditing
              ? "Update the teacher information below"
              : "Fill in the details to add a new teacher"}
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
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  Full Name <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter teacher's full name"
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="teacher@school.com"
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="555-0101"
                />
              </div>

              {/* Qualification */}
              <div className="form-group">
                <label className="form-label" htmlFor="qualification">
                  Qualification
                </label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  className="form-input"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g., Ph.D. in Mathematics"
                />
              </div>

              {/* Experience */}
              <div className="form-group">
                <label className="form-label" htmlFor="experience">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  className="form-input"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Employment Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="employmentType">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  className="form-input"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Join Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="joinDate">
                  Join Date
                </label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  className="form-input"
                  value={formData.joinDate}
                  onChange={handleChange}
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

              {/* Subjects */}
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label" htmlFor="subjects">
                  Subjects (comma-separated)
                </label>
                <input
                  type="text"
                  id="subjects"
                  name="subjects"
                  className="form-input"
                  value={formData.subjects.join(", ")}
                  onChange={handleSubjectsChange}
                  placeholder="Mathematics, Physics, Chemistry"
                />
                <small style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                  Enter subjects separated by commas
                </small>
              </div>
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
                  "Update Teacher"
                ) : (
                  "Add Teacher"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
