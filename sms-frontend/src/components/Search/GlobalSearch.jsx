import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import searchService from "../../services/searchService";
import { useToast } from "../../context/ToastContext";

const GlobalSearch = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Perform search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const response = await searchService.globalSearch(query);
      setResults(response);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (type, id) => {
    setIsOpen(false);
    setQuery("");
    setResults(null);

    switch (type) {
      case "student":
        navigate(`/students/edit/${id}`);
        break;
      case "teacher":
        navigate(`/teachers/edit/${id}`);
        break;
      case "class":
        navigate(`/classes`);
        break;
      case "event":
        navigate(`/events`);
        break;
      default:
        break;
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "student":
        return "👨‍🎓";
      case "teacher":
        return "👨‍🏫";
      case "class":
        return "🏫";
      case "event":
        return "📅";
      default:
        return "📄";
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          color: "var(--text-secondary)",
          fontSize: "14px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
        }}
      >
        <span>🔍</span>
        <span>Search...</span>
        <span
          style={{
            padding: "2px 6px",
            backgroundColor: "var(--bg-primary)",
            borderRadius: "4px",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          ⌘K
        </span>
      </button>
    );
  }

  return (
    <div
      ref={searchRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "100px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "var(--bg-primary)",
          borderRadius: "12px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <span style={{ fontSize: "20px" }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, teachers, classes, events..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              background: "transparent",
              color: "var(--text-primary)",
            }}
          />
          {loading && (
            <div
              className="loading-spinner"
              style={{ width: "20px", height: "20px" }}
            ></div>
          )}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: "4px 8px",
              backgroundColor: "var(--bg-secondary)",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {results && results.totalCount === 0 && (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p>No results found for "{query}"</p>
            </div>
          )}

          {results && results.totalCount > 0 && (
            <>
              {/* Students */}
              {results.results.students.count > 0 && (
                <div>
                  <div
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--bg-secondary)",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Students ({results.results.students.count})
                  </div>
                  {results.results.students.data.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => handleResultClick("student", student.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-color)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>
                        {getResultIcon("student")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600" }}>
                          {student.user?.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {student.admission_no} • {student.class_name}{" "}
                          {student.section}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Teachers */}
              {results.results.teachers.count > 0 && (
                <div>
                  <div
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--bg-secondary)",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Teachers ({results.results.teachers.count})
                  </div>
                  {results.results.teachers.data.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => handleResultClick("teacher", teacher.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-color)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>
                        {getResultIcon("teacher")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600" }}>{teacher.name}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {teacher.qualification} • {teacher.employmentType}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Classes */}
              {results.results.classes.count > 0 && (
                <div>
                  <div
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--bg-secondary)",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Classes ({results.results.classes.count})
                  </div>
                  {results.results.classes.data.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => handleResultClick("class", cls.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-color)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>
                        {getResultIcon("class")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600" }}>
                          {cls.grade} - Section {cls.section}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Room {cls.room} • {cls.students}/{cls.capacity}{" "}
                          students
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Events */}
              {results.results.events.count > 0 && (
                <div>
                  <div
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "var(--bg-secondary)",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Events ({results.results.events.count})
                  </div>
                  {results.results.events.data.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleResultClick("event", event.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid var(--border-color)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-secondary)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span style={{ fontSize: "24px" }}>
                        {getResultIcon("event")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600" }}>{event.title}</div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {event.type} •{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!results && !loading && (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⌨️</div>
              <p>Type at least 2 characters to search</p>
              <p style={{ fontSize: "12px", marginTop: "8px" }}>
                Search across students, teachers, classes, and events
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            padding: "8px 16px",
            backgroundColor: "var(--bg-secondary)",
            fontSize: "12px",
            color: "var(--text-secondary)",
            borderTop: "1px solid var(--border-color)",
          }}
        >
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
