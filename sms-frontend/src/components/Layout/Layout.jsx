import { Outlet, NavLink, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

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

  const getPageTitle = () => {
    const item = navItems.find((item) => item.path === location.pathname);
    return item?.label || "Dashboard";
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

            <button className="header-btn">
              🔔
              <span className="header-btn-badge">3</span>
            </button>

            <button className="header-btn">⚙️</button>

            <div className="user-avatar">AD</div>
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
