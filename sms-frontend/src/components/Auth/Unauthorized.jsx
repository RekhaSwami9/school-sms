import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div
        className="auth-card"
        style={{ textAlign: "center", maxWidth: "400px" }}
      >
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🚫</div>
        <h1>Access Denied</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
          You don't have permission to access this page.
        </p>

        <div
          style={{
            padding: "16px",
            background: "var(--background-color)",
            borderRadius: "8px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "14px",
              color: "var(--text-muted)",
            }}
          >
            Current Role
          </p>
          <p
            style={{
              margin: 0,
              fontWeight: "600",
              textTransform: "capitalize",
            }}
          >
            {user?.role || "Guest"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button className="btn btn-secondary" onClick={handleGoBack}>
            Go Back
          </button>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
