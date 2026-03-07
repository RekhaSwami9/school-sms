import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: "24px",
        }}
      >
        <div className="card-modern">
          <div className="card-body" style={{ padding: "16px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "32px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </div>
              <h3 style={{ margin: "0 0 4px" }}>{user?.name || "User"}</h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                {user?.email || "user@school.com"}
              </p>
            </div>
            <nav
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <button
                onClick={() => setActiveTab("profile")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    activeTab === "profile" ? "var(--primary)" : "transparent",
                  color:
                    activeTab === "profile" ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <span>👤</span> Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background:
                    activeTab === "security" ? "var(--primary)" : "transparent",
                  color:
                    activeTab === "security"
                      ? "white"
                      : "var(--text-secondary)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                <span>🔒</span> Security
              </button>
            </nav>
          </div>
        </div>

        <div>
          {activeTab === "profile" && (
            <div className="card-modern">
              <div className="card-header">
                <h3 className="card-title">Profile Information</h3>
              </div>
              <div className="card-body">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={user?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={user?.email || ""}
                      disabled
                    />
                  </div>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="card-modern">
              <div className="card-header">
                <h3 className="card-title">Change Password</h3>
              </div>
              <div className="card-body">
                <div style={{ maxWidth: "400px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <button className="btn btn-primary">Update Password</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
