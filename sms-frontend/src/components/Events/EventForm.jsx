import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventService from "../../services/eventService";
import { useToast } from "../../context/ToastContext";

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "Academic",
    description: "",
    location: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  const eventTypes = ["Academic", "Sports", "Cultural", "Holiday", "Meeting"];

  useEffect(() => {
    if (isEditing) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventService.getById(id);
      if (response.success) {
        const event = response.event;
        setFormData({
          title: event.title,
          date: event.date,
          type: event.type,
          description: event.description || "",
          location: event.location || "",
          time: event.time || "",
        });
      }
    } catch (error) {
      showToast("Failed to fetch event details", "error");
      navigate("/events");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToast("Event title is required", "error");
      return;
    }
    if (!formData.date) {
      showToast("Event date is required", "error");
      return;
    }
    if (!formData.type) {
      showToast("Event type is required", "error");
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        await eventService.update(id, formData);
        showToast("Event updated successfully!", "success");
      } else {
        await eventService.create(formData);
        showToast("Event created successfully!", "success");
      }
      navigate("/events");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Failed to save event. Please try again.";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/events");
  };

  if (fetchLoading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1>{isEditing ? "Edit Event" : "Create Event"}</h1>
        </div>
        <div className="card-modern">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <div className="loading-spinner"></div>
            <p>Loading event details...</p>
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
          <h1>{isEditing ? "Edit Event" : "Create New Event"}</h1>
          <p>
            {isEditing
              ? "Update the event details below"
              : "Fill in the details to create a new school event"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="card-modern">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {/* Title */}
              <div className="form-group">
                <label className="form-label" htmlFor="title">
                  Event Title <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="date">
                  Event Date <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Type */}
              <div className="form-group">
                <label className="form-label" htmlFor="type">
                  Event Type <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-input"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time */}
              <div className="form-group">
                <label className="form-label" htmlFor="time">
                  Time
                </label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g., 09:00 AM - 04:00 PM"
                />
              </div>

              {/* Location */}
              <div className="form-group">
                <label className="form-label" htmlFor="location">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., School Auditorium"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description..."
                rows="4"
                style={{ resize: "vertical" }}
              />
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span className="loading-spinner"></span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </span>
                ) : isEditing ? (
                  "Update Event"
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
