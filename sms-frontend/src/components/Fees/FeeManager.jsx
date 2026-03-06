import { useState } from "react";
import { feeStructure, paymentsData, classes } from "../../services/mockData";
import { useToast } from "../../context/ToastContext";

const FeeManager = () => {
  const { showSuccess, showToast } = useToast();
  const [activeTab, setActiveTab] = useState("structure");
  const [sendingReminder, setSendingReminder] = useState(null);

  const totalCollected = paymentsData
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = paymentsData
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = paymentsData.filter(
    (p) => p.status === "pending",
  ).length;

  const handleSendReminder = (payment) => {
    setSendingReminder(payment.id);

    // Simulate sending reminder
    setTimeout(() => {
      showSuccess(`Payment reminder sent to Student #${payment.studentId}!`);
      setSendingReminder(null);
    }, 1000);
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1>Fees & Payments</h1>
        <p>Manage fee structure and track payments</p>
      </div>

      {/* Stats */}
      <div
        className="stats-grid"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        <div className="stat-card-modern success">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Collected</span>
            <div className="stat-card-icon">💰</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--success)" }}>
            ₹{totalCollected.toLocaleString()}
          </div>
        </div>
        <div className="stat-card-modern danger">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Pending</span>
            <div className="stat-card-icon">⏳</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--danger)" }}>
            ₹{totalPending.toLocaleString()}
          </div>
        </div>
        <div className="stat-card-modern warning">
          <div className="stat-card-header">
            <span className="stat-card-title">Pending Payments</span>
            <div className="stat-card-icon">📋</div>
          </div>
          <div className="stat-card-value" style={{ color: "var(--warning)" }}>
            {pendingCount}
          </div>
        </div>
        <div className="stat-card-modern info">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Students</span>
            <div className="stat-card-icon">👨‍🎓</div>
          </div>
          <div className="stat-card-value">{paymentsData.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          {[
            { id: "structure", label: "Fee Structure", icon: "📋" },
            { id: "payments", label: "Payment History", icon: "💳" },
            { id: "pending", label: "Pending Fees", icon: "⚠️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "16px 24px",
                border: "none",
                backgroundColor: "transparent",
                borderBottom:
                  activeTab === tab.id ? "2px solid var(--primary)" : "none",
                color:
                  activeTab === tab.id
                    ? "var(--primary)"
                    : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? "600" : "500",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "structure" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Fee Structure by Grade</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Grade Group</th>
                  <th>Tuition Fee</th>
                  <th>Library Fee</th>
                  <th>Lab Fee</th>
                  <th>Sports Fee</th>
                  <th>Total Fee</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((fee) => (
                  <tr key={fee.id}>
                    <td style={{ fontWeight: "600" }}>{fee.grade}</td>
                    <td>₹{fee.tuitionFee.toLocaleString()}</td>
                    <td>₹{fee.libraryFee.toLocaleString()}</td>
                    <td>₹{fee.labFee.toLocaleString()}</td>
                    <td>₹{fee.sportsFee.toLocaleString()}</td>
                    <td style={{ fontWeight: "700", color: "var(--primary)" }}>
                      ₹{fee.totalFee.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className="card-body"
            style={{
              backgroundColor: "#f8fafc",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <h4 style={{ margin: "0 0 12px 0", fontSize: "16px" }}>
              Additional Information
            </h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              <li>
                Transportation fees are charged separately based on distance
              </li>
              <li>Late payment penalty: ₹100 per week after due date</li>
              <li>Scholarships available for meritorious students</li>
              <li>Payment can be made online, by card, or cash</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "payments" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Recent Payments</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData.map((payment) => (
                  <tr key={payment.id}>
                    <td style={{ fontFamily: "monospace" }}>
                      STU-{String(payment.studentId).padStart(4, "0")}
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td>{payment.type}</td>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>{payment.method || "-"}</td>
                    <td>
                      <span
                        className={`badge ${payment.status === "paid" ? "badge-success" : "badge-warning"}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "pending" && (
        <div className="card-modern">
          <div className="card-header">
            <h3 className="card-title">Pending Fee Payments</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Amount Due</th>
                  <th>Type</th>
                  <th>Due Date</th>
                  <th>Days Overdue</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentsData
                  .filter((p) => p.status === "pending")
                  .map((payment) => {
                    const daysOverdue = Math.floor(
                      (new Date() - new Date(payment.date)) /
                        (1000 * 60 * 60 * 24),
                    );
                    return (
                      <tr key={payment.id}>
                        <td style={{ fontFamily: "monospace" }}>
                          STU-{String(payment.studentId).padStart(4, "0")}
                        </td>
                        <td
                          style={{ fontWeight: "600", color: "var(--danger)" }}
                        >
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td>{payment.type}</td>
                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                        <td>
                          <span
                            style={{
                              color:
                                daysOverdue > 7
                                  ? "var(--danger)"
                                  : "var(--warning)",
                              fontWeight: "600",
                            }}
                          >
                            {daysOverdue > 0 ? `${daysOverdue} days` : "Today"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSendReminder(payment)}
                            disabled={sendingReminder === payment.id}
                          >
                            {sendingReminder === payment.id ? (
                              <span>
                                <span
                                  className="loading-spinner"
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    marginRight: "4px",
                                  }}
                                ></span>
                                Sending...
                              </span>
                            ) : (
                              "Send Reminder"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {paymentsData.filter((p) => p.status === "pending").length === 0 && (
            <div
              className="card-body"
              style={{ textAlign: "center", padding: "40px" }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
              <p style={{ color: "var(--text-secondary)" }}>
                No pending payments. All fees are up to date!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeeManager;
