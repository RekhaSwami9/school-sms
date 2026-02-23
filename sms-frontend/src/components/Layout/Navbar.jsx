import { Link, useNavigate } from "react-router-dom";
import GlobalSearch from "../Search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">🏫 School SMS</Link>
        </div>

        {/* Global Search */}
        <GlobalSearch />

        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/students">Students</Link>
          <Link to="/teachers">Teachers</Link>
          <Link to="/classes">Classes</Link>
          <Link to="/subjects">Subjects</Link>
          <Link to="/attendance">Attendance</Link>
          <Link to="/grades">Grades</Link>
          <Link to="/fees">Fees</Link>
          <Link to="/events">Events</Link>
          <Link to="/parents">Parents</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
