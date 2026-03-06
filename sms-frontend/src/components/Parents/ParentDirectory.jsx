import { useState, useEffect } from "react";
import { parentService } from "../../services/parentService";
import { useToast } from "../../context/ToastContext";

const ParentDirectory = () => {
  const { showSuccess, showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [parentsList, setParentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newParent, setNewParent] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    address: "",
  });

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const data = await parentService.getAll();
      if (data.success) {
        setParentsList(data.parents || []);
      }
    } catch (error) {
      console.error("Error fetching parents:", error);
      showToast("Failed to fetch parents", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredParents = parentsList.filter((parent) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (parent.name && parent.name.toLowerCase().includes(searchLower)) ||
      (parent.email && parent.email.toLowerCase().includes(searchLower)) ||
      (parent.phone && parent.phone.includes(searchTerm)) ||
      (parent.occupation &&
        parent.occupation.toLowerCase().includes(searchLower))
    );
  });

  const getChildrenForParent = (parentId) => {
    // For now, return empty - would need student-parent relationship API
    return [];
  };

  const handleParentClick = (parent) => {
    setSelectedParent(parent);
  };

  const handleCloseDetail = () => {
    setSelectedParent(null);
  };

  const handleAddParent = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewParent({
      name: "",
      email: "",
      phone: "",
      occupation: "",
      address: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitParent = async (e) => {
    e.preventDefault();

    if (!newParent.name || !newParent.email) {
      showToast("Please fill in required fields", "error");
      return;
    }

    try {
      const data = await parentService.create({
        name: newParent.name,
        email: newParent.email,
        phone: newParent.phone,
        occupation: newParent.occupation,
        address: newParent.address,
      });

      if (data.success) {
        showSuccess(`Parent "${newParent.name}" added successfully!`);
        fetchParents();
        handleCloseModal();
      } else {
        showToast(data.error || "Failed to create parent", "error");
      }
    } catch (error) {
      console.error("Error creating parent:", error);
      showToast("Failed to create parent", "error");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>Parents & Guardians</h1>
        <p>Manage parent information and student relationships</p>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Parents</span>
            <div className="stat-card-icon">👨‍👩‍👧</div>
          </div>
          <div className="stat-card-value">{parentsList.length}</div>
        </div>
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Active</span>
            <div className="stat-card-icon">👨</div>
          </div>
          <div className="stat-card-value">
            {parentsList.filter((p) => p.status === "Active").length}
          </div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">This Month</span>
            <div className="stat-card-icon">👩</div>
          </div>
          <div className="stat-card-value">{parentsList.length}</div>
        </div>
        <div className="stat-card-modern secondary">
          <div className="stat-card-header">
            <span className="stat-card-title">Total</span>
            <div className="stat-card-icon">👥</div>
          </div>
          <div className="stat-card-value">{parentsList.length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: "16px", alignItems: "end" }}>
            <div style={{ flex: "1" }}>
              <label className="form-label">Search Parents</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by name, email, phone, or occupation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: "44px" }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "16px",
                    opacity: 0.5,
                  }}
                >
                  🔍
                </span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleAddParent}>
              <span>+</span> Add Parent
            </button>
          </div>
        </div>
      </div>

      {/* Parent Detail Panel */}
      {selectedParent && (
        <div
          className="card-modern"
          style={{ marginBottom: "24px", backgroundColor: "#f8fafc" }}
        >
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "24px",
                }}
              >
                {selectedParent.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </div>
              <div>
                <h3 className="card-title" style={{ margin: 0 }}>
                  {selectedParent.name}
                </h3>
                <span
                  style={{
                    background: "var(--primary-lighter)",
                    color: "var(--primary)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {selectedParent.occupation}
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseDetail}
              className="btn btn-sm btn-secondary"
            >
              ✕ Close
            </button>
          </div>
          <div className="card-body">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  background: "white",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </p>
                <p style={{ margin: 0, fontWeight: "600" }}>
                  {selectedParent.email}
                </p>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "white",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Phone
                </p>
                <p style={{ margin: 0, fontWeight: "600" }}>
                  {selectedParent.phone}
                </p>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "white",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                  }}
                >
                  Address
                </p>
                <p style={{ margin: 0, fontWeight: "600" }}>
                  {selectedParent.address}
                </p>
              </div>
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
              }}
            >
              <h4 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>
                Children
              </h4>
              {getChildrenForParent(selectedParent.id).length > 0 ? (
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  {getChildrenForParent(selectedParent.id).map(
                    (child, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "12px 16px",
                          background: "var(--success-light)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span style={{ fontSize: "20px" }}>👤</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600" }}>
                            Student #{child.studentId}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "12px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {child.relation}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                  No children registered.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Parents Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredParents.map((parent) => {
          const children = getChildrenForParent(parent.id);
          return (
            <div
              key={parent.id}
              className="card-modern"
              style={{ cursor: "pointer" }}
              onClick={() => handleParentClick(parent)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow)";
              }}
            >
              <div className="card-body">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "20px",
                    }}
                  >
                    {parent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: "0 0 4px 0",
                        fontSize: "17px",
                        fontWeight: "600",
                      }}
                    >
                      {parent.name}
                    </h3>
                    <span
                      style={{
                        background: "#f1f5f9",
                        color: "var(--text-secondary)",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {parent.occupation}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>📧</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {parent.email}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>📱</span>
                    <span>{parent.phone}</span>
                  </div>
                </div>

                <div
                  style={{
                    paddingTop: "16px",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Children: <strong>{children.length}</strong>
                    </span>
                    <span
                      style={{
                        color: "var(--primary)",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredParents.length === 0 && (
        <div
          className="card-modern"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <p style={{ color: "var(--text-secondary)" }}>
            No parents found matching your search
          </p>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddModal && (
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
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ margin: 0 }}>Add New Parent</h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitParent}>
              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newParent.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={newParent.email}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., john.smith@email.com"
                  required
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={newParent.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., +1 234 567 8900"
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={newParent.occupation}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g., Engineer, Doctor, Business"
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={newParent.address}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter address..."
                  rows="3"
                />
              </div>

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
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Parent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDirectory;
