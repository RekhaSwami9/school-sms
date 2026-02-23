import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../services/studentService";
import {
  teachers,
  classes,
  subjects,
  eventsData,
  parentsData,
  feeStructure,
} from "../../services/mockData";
import { Link } from "react-router-dom";
import QuickActionModal from "../Common/QuickActionModal";
import { useToast } from "../../context/ToastContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [stats, setStats] = useState({
    totalStudents: 0,
    loading: true,
    error: null,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await studentService.getAll();
      setStats({
        totalStudents: data.students?.length || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      setStats({
        totalStudents: 0,
        loading: false,
        error: "Failed to load statistics",
      });
    }
  };

  // Calculate stats from mock data
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const totalSubjects = subjects.length;
  const totalParents = parentsData.length;
  const upcomingEvents = eventsData.filter(
    (e) => new Date(e.date) >= new Date(),
  ).length;
  const totalClassStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const avgOccupancy =
    (classes.reduce((sum, c) => sum + c.students / c.capacity, 0) /
      classes.length) *
    100;

  const quickLinks = [
    { label: "Students", path: "/students", icon: "👨‍🎓", color: "#9ca3af" },
    { label: "Teachers", path: "/teachers", icon: "👨‍🏫", color: "#10b981" },
    { label: "Classes", path: "/classes", icon: "🏫", color: "#f59e0b" },
    { label: "Subjects", path: "/subjects", icon: "📚", color: "#8b5cf6" },
    { label: "Attendance", path: "/attendance", icon: "📋", color: "#9ca3af" },
    { label: "Grades", path: "/grades", icon: "📊", color: "#ec4899" },
    { label: "Fees", path: "/fees", icon: "💰", color: "#14b8a6" },
    { label: "Events", path: "/events", icon: "📅", color: "#f97316" },
  ];

  const quickActions = [
    {
      label: "Add Student",
      action: () => openQuickModal("student"),
      icon: "➕",
      color: "#3b82f6",
    },
    {
      label: "Add Teacher",
      action: () => navigate("/teachers"),
      icon: "👨‍🏫",
      color: "#10b981",
    },
    {
      label: "Mark Attendance",
      action: () => openQuickModal("attendance"),
      icon: "📋",
      color: "#f59e0b",
    },
    {
      label: "Create Event",
      action: () => openQuickModal("event"),
      icon: "📅",
      color: "#ec4899",
    },
  ];

  const recentActivities = [
    {
      icon: "📚",
      text: "New student enrolled in Grade 10A",
      time: "2 min ago",
      color: "#9ca3af",
      action: () => navigate("/students"),
    },
    {
      icon: "💰",
      text: "Fee payment received: ₹25,000",
      time: "15 min ago",
      color: "#10b981",
      action: () => navigate("/fees"),
    },
    {
      icon: "📊",
      text: "Grades updated for Mathematics",
      time: "1 hour ago",
      color: "#ec4899",
      action: () => navigate("/grades"),
    },
    {
      icon: "📅",
      text: "Sports Day event scheduled",
      time: "3 hours ago",
      color: "#f97316",
      action: () => navigate("/events"),
    },
    {
      icon: "👨‍🏫",
      text: "New teacher joined: Dr. Smith",
      time: "5 hours ago",
      color: "#8b5cf6",
      action: () => navigate("/teachers"),
    },
  ];

  const upcomingEventsList = eventsData
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Helper function to get event type color
  const getEventTypeColor = (type) => {
    switch (type) {
      case "Academic":
        return "#3b82f6";
      case "Sports":
        return "#10b981";
      case "Cultural":
        return "#8b5cf6";
      case "Holiday":
        return "#f59e0b";
      case "Meeting":
        return "#64748b";
      default:
        return "#6b7280";
    }
  };

  // Helper function to get relative time
  const getRelativeTime = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `in ${diffDays} days`;
    if (diffDays < 30) return `in ${Math.ceil(diffDays / 7)} weeks`;
    return `in ${Math.ceil(diffDays / 30)} months`;
  };

  const handleRefresh = () => {
    fetchStats();
    showSuccess("Dashboard refreshed successfully!");
  };

  const openQuickModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const closeQuickModal = () => {
    setModalOpen(false);
    setModalAction("");
  };

  const handleActivityClick = (action) => {
    if (action) action();
  };

  const handleEventClick = (eventId) => {
    navigate(`/events`);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening at your school today.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span>🔄</span> Refresh
        </button>
      </div>

      {/* Quick Actions */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
            }}
          >
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 16px",
                  backgroundColor: action.color + "15",
                  color: action.color,
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = action.color + "25";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = action.color + "15";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "18px" }}>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dbeafe" }}>
            👨‍🎓
          </div>
          <div className="stat-content">
            <h3>{stats.loading ? "..." : stats.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#dcfce7" }}>
            👨‍🏫
          </div>
          <div className="stat-content">
            <h3>{totalTeachers}</h3>
            <p>Total Teachers</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fef3c7" }}>
            🏫
          </div>
          <div className="stat-content">
            <h3>{totalClasses}</h3>
            <p>Total Classes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f3e8ff" }}>
            📚
          </div>
          <div className="stat-content">
            <h3>{totalSubjects}</h3>
            <p>Total Subjects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#fce7f3" }}>
            👨‍👩‍👧
          </div>
          <div className="stat-content">
            <h3>{totalParents}</h3>
            <p>Total Parents</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#ffedd5" }}>
            📅
          </div>
          <div className="stat-content">
            <h3>{upcomingEvents}</h3>
            <p>Upcoming Events</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-header">
          <h3 className="card-title">Quick Navigation</h3>
          <Link to="/" style={{ fontSize: "14px", color: "var(--primary)" }}>
            View All
          </Link>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
            }}
          >
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px",
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  border: "1px solid var(--border-color)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = link.color + "15";
                  e.currentTarget.style.borderColor = link.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: link.color + "20",
                    borderRadius: "6px",
                  }}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Recent Activity */}
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <Link to="/" style={{ fontSize: "14px", color: "var(--primary)" }}>
              View All
            </Link>
          </div>
          <div className="card-body">
            <div className="activity-feed">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="activity-item"
                  onClick={() => handleActivityClick(activity.action)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="activity-icon"
                    style={{
                      backgroundColor: activity.color + "15",
                      color: activity.color,
                    }}
                  >
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">{activity.text}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Upcoming Events</h3>
            <Link
              to="/events"
              style={{ fontSize: "14px", color: "var(--primary)" }}
            >
              View All
            </Link>
          </div>
          <div className="card-body">
            {upcomingEventsList.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <p style={{ color: "var(--text-secondary)" }}>
                  No upcoming events.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {upcomingEventsList.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event.id)}
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "16px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "12px",
                      borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f1f5f9";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <div
                      style={{
                        minWidth: "60px",
                        textAlign: "center",
                        background: "white",
                        borderRadius: "10px",
                        padding: "10px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: "var(--text-secondary)",
                          textTransform: "uppercase",
                        }}
                      >
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </div>
                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "var(--primary)",
                        }}
                      >
                        {new Date(event.date).getDate()}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "6px",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                          }}
                        >
                          {event.title}
                        </h4>
                        <span
                          style={{
                            fontSize: "11px",
                            padding: "3px 8px",
                            borderRadius: "12px",
                            backgroundColor:
                              getEventTypeColor(event.type) + "20",
                            color: getEventTypeColor(event.type),
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.type}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "0 0 8px 0",
                          color: "var(--text-secondary)",
                          fontSize: "13px",
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {event.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "12px",
                          color: "var(--text-muted)",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>📍</span> {event.location}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span>🕐</span> {event.time}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            color: getEventTypeColor(event.type),
                            fontWeight: "500",
                          }}
                        >
                          <span>⏰</span> {getRelativeTime(event.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickActionModal
        isOpen={modalOpen}
        onClose={closeQuickModal}
        actionType={modalAction}
      />
    </div>
  );
};

export default Dashboard;
