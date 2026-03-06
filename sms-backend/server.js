require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/auth");
const studentRoutes = require("./src/routes/students");
const eventRoutes = require("./src/routes/events");
const teacherRoutes = require("./src/routes/teachers");
const classRoutes = require("./src/routes/classes");
const attendanceRoutes = require("./src/routes/attendance");
const gradeRoutes = require("./src/routes/grades");
const searchRoutes = require("./src/routes/search");
const subjectRoutes = require("./src/routes/subjects");
const parentRoutes = require("./src/routes/parents");
const feeRoutes = require("./src/routes/fees");

const app = express();
const PORT = process.env.PORT || 5001;
const isProduction = process.env.NODE_ENV === "production";

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
  origin: isProduction
    ? process.env.FRONTEND_URL || "https://your-production-domain.com"
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10kb" })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Logging
if (isProduction) {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => res.json({ message: "SMS backend running" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/fees", feeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors.map((e) => e.message),
    });
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      message: "Resource already exists",
      errors: err.errors.map((e) => e.message),
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Default error
  res.status(err.status || 500).json({
    message: isProduction ? "Internal server error" : err.message,
    ...(!isProduction && { stack: err.stack }),
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync({ alter: !isProduction });
    console.log("Database synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `Environment: ${isProduction ? "production" : "development"}`,
      );
    });
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
