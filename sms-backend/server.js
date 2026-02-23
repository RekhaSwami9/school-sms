require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./src/models");
const authRoutes = require("./src/routes/auth");
const studentRoutes = require("./src/routes/students");
const eventRoutes = require("./src/routes/events");
const teacherRoutes = require("./src/routes/teachers");
const classRoutes = require("./src/routes/classes");
const attendanceRoutes = require("./src/routes/attendance");
const gradeRoutes = require("./src/routes/grades");
const searchRoutes = require("./src/routes/search");

const app = express();
const PORT = 5001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "SMS backend running" }));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/search", searchRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch((err) => {
    console.error("Unable to connect to DB:", err);
  });
