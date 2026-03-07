import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Unauthorized from "./components/Auth/Unauthorized";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import StudentList from "./components/Students/StudentList";
import StudentForm from "./components/Students/StudentForm";
import TeacherList from "./components/Teachers/TeacherList";
import TeacherForm from "./components/Teachers/TeacherForm";
import ClassList from "./components/Classes/ClassList";
import ClassForm from "./components/Classes/ClassForm";
import SubjectList from "./components/Subjects/SubjectList";
import AttendanceTracker from "./components/Attendance/AttendanceTracker";
import GradeManager from "./components/Grades/GradeManager";
import FeeManager from "./components/Fees/FeeManager";
import EventCalendar from "./components/Events/EventCalendar";
import EventForm from "./components/Events/EventForm";
import ParentDirectory from "./components/Parents/ParentDirectory";
import "./App.css";

// Role definitions
const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
  ACCOUNTANT: "accountant",
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute
                  allowedRoles={[
                    ROLES.ADMIN,
                    ROLES.TEACHER,
                    ROLES.STUDENT,
                    ROLES.PARENT,
                    ROLES.ACCOUNTANT,
                  ]}
                >
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard - All authenticated users */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* Admin only routes */}
              <Route
                path="students"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <StudentList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="students/new"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <StudentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="students/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <StudentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teachers"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <TeacherList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teachers/new"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <TeacherForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="teachers/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <TeacherForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="classes"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <ClassList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="classes/new"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <ClassForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="classes/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <ClassForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="subjects"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <SubjectList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="parents"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <ParentDirectory />
                  </ProtectedRoute>
                }
              />

              {/* Teacher and Admin routes */}
              <Route
                path="attendance"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <AttendanceTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="grades"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <GradeManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="events"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <EventCalendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="events/new"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <EventForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="events/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <EventForm />
                  </ProtectedRoute>
                }
              />

              {/* Accountant and Admin routes */}
              <Route
                path="fees"
                element={
                  <ProtectedRoute
                    allowedRoles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}
                  >
                    <FeeManager />
                  </ProtectedRoute>
                }
              />

              {/* Student and Parent - view grades/attendance */}
              <Route
                path="my-grades"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PARENT]}>
                    <GradeManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-attendance"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PARENT]}>
                    <AttendanceTracker />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
