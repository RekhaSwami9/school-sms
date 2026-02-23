import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { studentService } from "../../services/studentService";
import { useToast } from "../../context/ToastContext";

const StudentForm = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    admission_no: "",
    dob: "",
    gender: "",
    class_name: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setFetchLoading(true);
      const data = await studentService.getById(id);
      const student = data.student;
      setFormData({
        name: student.user?.name || "",
        email: student.user?.email || "",
        password: "",
        admission_no: student.admission_no || "",
        dob: student.dob || "",
        gender: student.gender || "",
        class_name: student.class_name || "",
        section: student.section || "",
      });
    } catch (err) {
      setError("Failed to load student data");
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      showError("Name and email are required");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await studentService.update(id, formData);
        showSuccess("Student updated successfully!");
      } else {
        await studentService.create(formData);
        showSuccess("Student created successfully!");
      }
      setTimeout(() => {
        navigate("/students");
      }, 1000);
    } catch (err) {
      showError(
        err.response?.data?.error ||
          err.response?.data?.msg ||
          `Failed to ${isEditMode ? "update" : "create"} student`,
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div>
        <h1>{isEditMode ? "Edit Student" : "Add New Student"}</h1>
        <div
          className="card"
          style={{
            maxWidth: "600px",
            marginTop: "20px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>⏳</div>
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{isEditMode ? "Edit Student" : "Add New Student"}</h1>

      <div className="card" style={{ maxWidth: "600px", marginTop: "20px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter student's full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter student's email"
            />
          </div>

          {!isEditMode && (
            <div className="form-group">
              <label htmlFor="password">Password (default: student123)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="admission_no">Admission Number</label>
            <input
              type="text"
              id="admission_no"
              name="admission_no"
              value={formData.admission_no}
              onChange={handleChange}
              placeholder="e.g., ADM001"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div className="form-group">
              <label htmlFor="class_name">Class</label>
              <input
                type="text"
                id="class_name"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                placeholder="e.g., 10th Grade"
              />
            </div>

            <div className="form-group">
              <label htmlFor="section">Section</label>
              <input
                type="text"
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., A, B, C"
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Student"
                  : "Create Student"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/students")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
