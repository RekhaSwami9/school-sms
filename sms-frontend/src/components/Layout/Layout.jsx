import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/students", label: "Students", icon: "👨‍🎓" },
    { path: "/teachers", label: "Teachers", icon: "👨‍🏫" },
    { path: "/classes", label: "Classes", icon: "🏫" },
    { path: "/subjects", label: "Subjects", icon: "📚" },
    { path: "/attendance", label: "Attendance", icon: "📋" },
    { path: "/grades", label: "Grades", icon: "📈" },
    { path: "/fees", label: "Fees", icon: "💰" },
    { path: "/events", label: "Events", icon: "📅" },
    { path: "/parents", label: "Parents", icon: "👨‍👩‍👧" },
  ];

  // Sample notifications
  const notifications = [
    { id: 1, message: "New student registered", time: "2 min ago" },
    { id: 2, message: "Attendance report ready", time: "1 hour ago" },
    { id: 3, message: "Fee payment received", time: "3 hours ago" },
  ];

  const getPageTitle = () => {
    const item = navItems.find((item) => item.path === location.pathname);
    return item?.label || "Dashboard";
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/login");
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "AD";
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="sidebar-brand">
            <div className="sidebar-brand-icon">🏫</div>
            <span className="sidebar-brand-text">School ERP</span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 School ERP</p>
          <p>v1.0.0</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-title">{getPageTitle()}</div>

          <div className="header-actions">
            <div className="header-search">
              <input type="text" placeholder="Search..." />
            </div>

            {/* Notifications Button */}
            <div className="header-btn-container">
              <button
                className="header-btn"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                title="Notifications"
              >
                🔔
                <span className="header-btn-badge">{notifications.length}</span>
              </button>
              {showNotifications && (
                <div className="dropdown-menu notifications-dropdown">
                  <div className="dropdown-header">
                    <span>Notifications</span>
                    <button className="mark-read">Mark all read</button>
                  </div>
                  <div className="dropdown-content">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="notification-item">
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button>View All Notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button className="header-btn" title="Settings">
              ⚙️
            </button>

            {/* User Avatar with Menu */}
            <div className="header-btn-container">
              <div
                className="user-avatar"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                title="User Menu"
                style={{ cursor: "pointer" }}
              >
                {getUserInitials()}
              </div>
              {showUserMenu && (
                <div className="dropdown-menu user-dropdown">
                  <div className="user-info">
                    <div className="user-avatar-large">{getUserInitials()}</div>
                    <div>
                      <p className="user-name">{user?.name || "Admin User"}</p>
                      <p className="user-email">
                        {user?.email || "admin@school.com"}
                      </p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/profile")}
                  >
                    👤 Profile Settings
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => navigate("/")}
                  >
                    ⚙️ Account Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
