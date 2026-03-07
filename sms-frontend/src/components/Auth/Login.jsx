import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login (default to dashboard)
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to School SMS</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "16px" }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "var(--background-color)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>
            Demo Account:
          </p>
          <p style={{ margin: "0 0 4px 0" }}>Email: test@school.edu</p>
          <p style={{ margin: "0" }}>Password: test123</p>
          <p style={{ margin: "4px 0 0 0", color: "var(--text-muted)" }}>
            Role: admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
