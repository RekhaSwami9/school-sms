import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import eventService from "../../services/eventService";
import { useToast } from "../../context/ToastContext";

const EventCalendar = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const eventTypes = [
    "all",
    "Academic",
    "Sports",
    "Cultural",
    "Holiday",
    "Meeting",
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAll();
      if (response.success) {
        setEvents(response.events);
      }
    } catch (error) {
      showToast("Failed to fetch events", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents =
    filterType === "all" ? events : events.filter((e) => e.type === filterType);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );

  const upcomingEvents = sortedEvents.filter(
    (e) => new Date(e.date) >= new Date(),
  );
  const pastEvents = sortedEvents.filter((e) => new Date(e.date) < new Date());

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

  const handleCreateEvent = () => {
    navigate("/events/new");
  };

  const handleEditEvent = (id) => {
    navigate(`/events/edit/${id}`);
  };

  const handleDeleteClick = (event) => {
    setDeleteConfirm(event);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      await eventService.delete(deleteConfirm.id);
      showToast("Event deleted successfully!", "success");
      fetchEvents();
    } catch (error) {
      showToast("Failed to delete event", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRelativeTime = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `in ${diffDays} days`;
    if (diffDays < 30) return `in ${Math.ceil(diffDays / 7)} weeks`;
    return `in ${Math.ceil(diffDays / 30)} months`;
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>Events & Calendar</h1>
        </div>
        <div className="card-modern">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
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
          <h1>Events & Calendar</h1>
          <p>Manage school events and academic calendar</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateEvent}>
          <span style={{ marginRight: "8px" }}>+</span>
          Create Event
        </button>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Events</span>
            <div className="stat-card-icon">📅</div>
          </div>
          <div className="stat-card-value">{events.length}</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Upcoming</span>
            <div className="stat-card-icon">🚀</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            {upcomingEvents.length}
          </div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">This Month</span>
            <div className="stat-card-icon">📆</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--warning)" }}>
            {
              events.filter((e) => {
                const eventDate = new Date(e.date);
                const now = new Date();
                return (
                  eventDate.getMonth() === now.getMonth() &&
                  eventDate.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Past Events</span>
            <div className="stat-card-icon">📚</div>
          </div>
          <div className="stat-card-value">{pastEvents.length}</div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div
          className="card-body"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontWeight: "500", color: "var(--text-secondary)" }}>
              Filter by Type:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
            >
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`btn ${viewMode === "list" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setViewMode("list")}
            >
              📋 List
            </button>
            <button
              className={`btn ${viewMode === "calendar" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setViewMode("calendar")}
            >
              📅 Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
            }}
          >
            <h3 style={{ marginBottom: "16px" }}>Confirm Delete</h3>
            <p style={{ marginBottom: "24px", color: "var(--text-secondary)" }}>
              Are you sure you want to delete "{deleteConfirm.title}"? This
              action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                style={{ backgroundColor: "var(--danger)", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      {viewMode === "list" ? (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">
              {filterType === "all" ? "All Events" : `${filterType} Events`}
            </h3>
            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              {sortedEvents.length} events found
            </span>
          </div>
          <div className="card-body">
            {sortedEvents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <p style={{ color: "var(--text-secondary)" }}>
                  No events found. Create your first event!
                </p>
                <button
                  className="btn btn-primary"
                  onClick={handleCreateEvent}
                  style={{ marginTop: "16px" }}
                >
                  Create Event
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {sortedEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      display: "flex",
                      gap: "16px",
                      padding: "20px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "12px",
                      borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Date Box */}
                    <div
                      style={{
                        minWidth: "70px",
                        textAlign: "center",
                        background: "white",
                        borderRadius: "10px",
                        padding: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
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
                          fontSize: "28px",
                          fontWeight: "700",
                          color: "var(--primary)",
                        }}
                      >
                        {new Date(event.date).getDate()}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: getEventTypeColor(event.type),
                          fontWeight: "500",
                        }}
                      >
                        {getRelativeTime(event.date)}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          marginBottom: "8px",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "var(--text-primary)",
                          }}
                        >
                          {event.title}
                        </h4>
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            backgroundColor:
                              getEventTypeColor(event.type) + "20",
                            color: getEventTypeColor(event.type),
                            fontWeight: "600",
                          }}
                        >
                          {event.type}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "0 0 12px 0",
                          color: "var(--text-secondary)",
                          fontSize: "14px",
                          lineHeight: "1.5",
                        }}
                      >
                        {event.description || "No description provided"}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          fontSize: "13px",
                          color: "var(--text-muted)",
                          flexWrap: "wrap",
                          marginBottom: "12px",
                        }}
                      >
                        {event.location && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>📍</span> {event.location}
                          </span>
                        )}
                        {event.time && (
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>🕐</span> {event.time}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "6px 12px", fontSize: "12px" }}
                          onClick={() => handleEditEvent(event.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            color: "var(--danger)",
                          }}
                          onClick={() => handleDeleteClick(event)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Calendar View</h3>
          </div>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    padding: "10px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "10px",
              }}
            >
              {Array.from({ length: 35 }, (_, i) => {
                const dayNumber = (i % 31) + 1;
                const dayEvents = events.filter((e) => {
                  const eventDate = new Date(e.date);
                  return eventDate.getDate() === dayNumber;
                });

                return (
                  <div
                    key={i}
                    style={{
                      minHeight: "80px",
                      padding: "8px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      {dayNumber}
                    </div>
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        style={{
                          fontSize: "10px",
                          padding: "3px 6px",
                          backgroundColor: getEventTypeColor(event.type),
                          color: "white",
                          borderRadius: "4px",
                          marginBottom: "3px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                        onClick={() => handleEditEvent(event.id)}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div
                        style={{ fontSize: "10px", color: "var(--text-muted)" }}
                      >
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
