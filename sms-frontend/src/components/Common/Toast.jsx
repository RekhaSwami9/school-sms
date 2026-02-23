import { useEffect, useState } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      setProgress(newProgress);

      if (newProgress > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    const progressAnimation = requestAnimationFrame(updateProgress);

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(progressAnimation);
    };
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "✅";
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return { bg: "#dcfce7", border: "#10b981", text: "#166534" };
      case "error":
        return { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" };
      case "warning":
        return { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" };
      case "info":
        return { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" };
      default:
        return { bg: "#dcfce7", border: "#10b981", text: "#166534" };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "300px",
        maxWidth: "400px",
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        animation: "slideIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontSize: "20px" }}>{getIcon()}</span>
        <span
          style={{
            fontWeight: "600",
            color: colors.text,
            fontSize: "14px",
          }}
        >
          {message}
        </span>
        <button
          onClick={onClose}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "18px",
            color: colors.text,
            opacity: 0.6,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "1")}
          onMouseLeave={(e) => (e.target.style.opacity = "0.6")}
        >
          ×
        </button>
      </div>
      <div
        style={{
          height: "3px",
          backgroundColor: colors.border,
          borderRadius: "2px",
          width: `${progress}%`,
          transition: "width 0.1s linear",
        }}
      />
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
