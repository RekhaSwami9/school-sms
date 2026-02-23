import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="students/new" element={<StudentForm />} />
              <Route path="students/edit/:id" element={<StudentForm />} />
              <Route path="teachers" element={<TeacherList />} />
              <Route path="teachers/new" element={<TeacherForm />} />
              <Route path="teachers/edit/:id" element={<TeacherForm />} />
              <Route path="classes" element={<ClassList />} />
              <Route path="classes/new" element={<ClassForm />} />
              <Route path="classes/edit/:id" element={<ClassForm />} />
              <Route path="subjects" element={<SubjectList />} />
              <Route path="attendance" element={<AttendanceTracker />} />
              <Route path="grades" element={<GradeManager />} />
              <Route path="fees" element={<FeeManager />} />
              <Route path="events" element={<EventCalendar />} />
              <Route path="events/new" element={<EventForm />} />
              <Route path="events/edit/:id" element={<EventForm />} />
              <Route path="parents" element={<ParentDirectory />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
