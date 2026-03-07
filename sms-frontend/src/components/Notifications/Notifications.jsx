import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Notifications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "info",
      title: "Welcome to School SMS",
      message:
        "Welcome to the School Management System! Get started by exploring the dashboard.",
      time: "Just now",
      read: false,
    },
    {
      id: 2,
      type: "event",
      title: "Upcoming Event: Sports Day",
      message:
        "Sports Day is scheduled for next Friday. All students are required to participate.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "fee",
      title: "Fee Payment Reminder",
      message:
        "Please remember to pay the monthly fees by the 5th of each month.",
      time: "5 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "grade",
      title: "Grades Updated",
      message:
        "Your grades for the recent Mathematics test have been uploaded.",
      time: "1 day ago",
      read: true,
    },
    {
      id: 5,
      type: "attendance",
      title: "Attendance Report",
      message: "Your attendance this month is 95%. Keep it up!",
      time: "2 days ago",
      read: true,
    },
    {
      id: 6,
      type: "info",
      title: "New Course Material",
      message: "New study materials have been uploaded for Grade 10 students.",
      time: "3 days ago",
      read: true,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "event":
        return "📅";
      case "fee":
        return "💰";
      case "grade":
        return "📊";
      case "attendance":
        return "📋";
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "event":
        return "#f97316";
      case "fee":
        return "#10b981";
      case "grade":
        return "#8b5cf6";
      case "attendance":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.read);

  const markAsRead = (id) => {
    // In a real app, this would update the backend
    alert(`Notification ${id} marked as read`);
  };

  const markAllAsRead = () => {
    alert("All notifications marked as read");
  };

  const deleteNotification = (id) => {
    alert(`Notification ${id} deleted`);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with school announcements and alerts</p>
        </div>
        <button onClick={markAllAsRead} className="btn btn-secondary">
          ✓ Mark All as Read
        </button>
      </div>

      {/* Filters */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor:
                  filter === "all" ? "var(--primary)" : "var(--bg-secondary)",
                color: filter === "all" ? "white" : "var(--text-primary)",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor:
                  filter === "unread"
                    ? "var(--primary)"
                    : "var(--bg-secondary)",
                color: filter === "unread" ? "white" : "var(--text-primary)",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
            <button
              onClick={() => setFilter("read")}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor:
                  filter === "read" ? "var(--primary)" : "var(--bg-secondary)",
                color: filter === "read" ? "white" : "var(--text-primary)",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Read ({notifications.filter((n) => n.read).length})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className="card-modern"
            style={{
              borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
              opacity: notification.read ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            <div
              className="card-body"
              style={{ display: "flex", gap: "16px", alignItems: "start" }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor:
                    getNotificationColor(notification.type) + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  flexShrink: 0,
                }}
              >
                {getNotificationIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "4px",
                  }}
                >
                  <h3
                    style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}
                  >
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "var(--primary)",
                        flexShrink: 0,
                      }}
                    ></span>
                  )}
                </div>
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {notification.message}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: "12px", color: "var(--text-muted)" }}
                  >
                    {notification.time}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          padding: "6px 12px",
                          border: "none",
                          borderRadius: "6px",
                          backgroundColor: "var(--primary-color-light)",
                          color: "var(--primary)",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      style={{
                        padding: "6px 12px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#fee2e2",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px 20px" }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔔</div>
          <h3 style={{ margin: "0 0 8px" }}>No Notifications</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            {filter === "unread"
              ? "You've read all your notifications!"
              : "No notifications to display."}
          </p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="card-modern" style={{ marginTop: "24px" }}>
        <div className="card-header">
          <h3 className="card-title">Notification Settings</h3>
        </div>
        <div className="card-body">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{ width: "18px", height: "18px" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>Email Notifications</div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Receive updates via email
                </div>
              </div>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{ width: "18px", height: "18px" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>Event Reminders</div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Get notified about upcoming events
                </div>
              </div>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{ width: "18px", height: "18px" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>Fee Alerts</div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  Payment reminders
                </div>
              </div>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                defaultChecked
                style={{ width: "18px", height: "18px" }}
              />
              <div>
                <div style={{ fontWeight: "500" }}>Grade Updates</div>
                <div
                  style={{ fontSize: "12px", color: "var(--text-secondary)" }}
                >
                  New grades and results
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
