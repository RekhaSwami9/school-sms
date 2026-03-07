import { Link, useNavigate } from "react-router-dom";
import GlobalSearch from "../Search/GlobalSearch";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const {
    user,
    isAdmin,
    isTeacher,
    isAccountant,
    isStudent,
    isParent,
    logout,
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/dashboard">🏫 School SMS</Link>
        </div>

        {/* Global Search - Only for admin, teacher, accountant */}
        {(isAdmin || isTeacher || isAccountant) && <GlobalSearch />}

        <div className="navbar-links">
          <Link to="/dashboard" title="Dashboard">
            <span className="nav-icon">📊</span> Dashboard
          </Link>

          {/* Admin only */}
          {isAdmin && (
            <>
              <Link to="/students" title="Students">
                <span className="nav-icon">👨‍🎓</span> Students
              </Link>
              <Link to="/teachers" title="Teachers">
                <span className="nav-icon">👨‍🏫</span> Teachers
              </Link>
              <Link to="/parents" title="Parents">
                <span className="nav-icon">👨‍👩‍👧</span> Parents
              </Link>
            </>
          )}

          {/* Admin and Teacher */}
          {(isAdmin || isTeacher) && (
            <>
              <Link to="/classes" title="Classes">
                <span className="nav-icon">🏠</span> Classes
              </Link>
              <Link to="/subjects" title="Subjects">
                <span className="nav-icon">📚</span> Subjects
              </Link>
              <Link to="/attendance" title="Attendance">
                <span className="nav-icon">✅</span> Attendance
              </Link>
              <Link to="/grades" title="Grades">
                <span className="nav-icon">📝</span> Grades
              </Link>
              <Link to="/events" title="Events">
                <span className="nav-icon">📅</span> Events
              </Link>
            </>
          )}

          {/* Admin and Accountant */}
          {(isAdmin || isAccountant) && (
            <>
              <Link to="/fees" title="Fees">
                <span className="nav-icon">💰</span> Fees
              </Link>
            </>
          )}

          {/* Student and Parent */}
          {(isStudent || isParent) && (
            <>
              <Link to="/my-grades" title="My Grades">
                <span className="nav-icon">📋</span> My Grades
              </Link>
              <Link to="/my-attendance" title="My Attendance">
                <span className="nav-icon">✓</span> My Attendance
              </Link>
            </>
          )}
        </div>

        {/* User Info and Logout */}
        <div
          className="navbar-user"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginLeft: "auto",
          }}
        >
          <Link to="/profile" title="Profile" style={{ textDecoration: "none", color: "var(--text-secondary)", fontSize: "14px" }}>👤 Profile</Link>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            {user?.name || "User"}
          </span>
          <span
            style={{
              marginLeft: "8px",
              padding: "2px 8px",
              background: "var(--primary-color)",
              color: "white",
              borderRadius: "4px",
              fontSize: "11px",
              textTransform: "capitalize",
            }}
          >
            {user?.role || "Guest"}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-secondary"
            style={{ padding: "6px 12px" }}
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
