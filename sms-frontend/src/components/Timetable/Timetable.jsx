import { useState } from "react";

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const classes = ["Grade 9-A", "Grade 9-B", "Grade 10-A", "Grade 10-B", "Grade 11-A", "Grade 12-A"];
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const timeSlots = [
    { time: "08:00 - 08:45", break: false },
    { time: "08:45 - 09:30", break: false },
    { time: "09:30 - 09:45", break: true, label: "Break" },
    { time: "09:45 - 10:30", break: false },
    { time: "10:30 - 11:15", break: false },
    { time: "11:15 - 11:30", break: true, label: "Break" },
    { time: "11:30 - 12:15", break: false },
    { time: "12:15 - 13:00", break: false },
    { time: "13:00 - 14:00", break: true, label: "Lunch" },
    { time: "14:00 - 14:45", break: false },
    { time: "14:45 - 15:30", break: false },
  ];

  const timetableData = {
    "Grade 10-A": {
      Monday: [
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        { subject: "Science", teacher: "Dr. Johnson", room: "102" },
        {}, // Break
        { subject: "English", teacher: "Ms. Davis", room: "103" },
        { subject: "History", teacher: "Mr. Wilson", room: "104" },
        {}, // Break
        { subject: "Art", teacher: "Mrs. Brown", room: "105" },
        { subject: "Physical Ed", teacher: "Coach Miller", room: "Gym" },
        {}, // Lunch
        { subject: "Computer", teacher: "Mr. Taylor", room: "Lab 1" },
        { subject: "Music", teacher: "Ms. Anderson", room: "106" },
      ],
      Tuesday: [
        { subject: "English", teacher: "Ms. Davis", room: "103" },
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        {}, // Break
        { subject: "Science", teacher: "Dr. Johnson", room: "102" },
        { subject: "Geography", teacher: "Mr. White", room: "107" },
        {}, // Break
        { subject: "History", teacher: "Mr. Wilson", room: "104" },
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        {}, // Lunch
        { subject: "Science Lab", teacher: "Dr. Johnson", room: "Lab 2" },
        { subject: "Library", teacher: "Ms. Garcia", room: "Library" },
      ],
      Wednesday: [
        { subject: "Science", teacher: "Dr. Johnson", room: "102" },
        { subject: "English", teacher: "Ms. Davis", room: "103" },
        {}, // Break
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        { subject: "Art", teacher: "Mrs. Brown", room: "105" },
        {}, // Break
        { subject: "Music", teacher: "Ms. Anderson", room: "106" },
        { subject: "History", teacher: "Mr. Wilson", room: "104" },
        {}, // Lunch
        { subject: "Physical Ed", teacher: "Coach Miller", room: "Gym" },
        { subject: "Computer", teacher: "Mr. Taylor", room: "Lab 1" },
      ],
      Thursday: [
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        { subject: "History", teacher: "Mr. Wilson", room: "104" },
        {}, // Break
        { subject: "English", teacher: "Ms. Davis", room: "103" },
        { subject: "Science", teacher: "Dr. Johnson", room: "102" },
        {}, // Break
        { subject: "Geography", teacher: "Mr. White", room: "107" },
        { subject: "Art", teacher: "Mrs. Brown", room: "105" },
        {}, // Lunch
        { subject: "Science Lab", teacher: "Dr. Johnson", room: "Lab 2" },
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
      ],
      Friday: [
        { subject: "English", teacher: "Ms. Davis", room: "103" },
        { subject: "Art", teacher: "Mrs. Brown", room: "105" },
        {}, // Break
        { subject: "Science", teacher: "Dr. Johnson", room: "102" },
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        {}, // Break
        { subject: "Physical Ed", teacher: "Coach Miller", room: "Gym" },
        { subject: "Music", teacher: "Ms. Anderson", room: "106" },
        {}, // Lunch
        { subject: "Computer", teacher: "Mr. Taylor", room: "Lab 1" },
        { subject: "History", teacher: "Mr. Wilson", room: "104" },
      ],
      Saturday: [
        { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
        { subject: "Science", teacher: "Dr. Johnson", room: "102" },
        {}, // Break
        { subject: "English", teacher: "Ms. Davis", room: "103" },
        { subject: "Sports Practice", teacher: "Coach Miller", room: "Field" },
        {}, // Break
        { subject: "Club Activities", teacher: "Various", room: "Various" },
        { subject: "Assembly", teacher: "Principal", room: "Hall" },
      ],
    },
  };

  const currentSchedule = timetableData[selectedClass]?.[selectedDay] || [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Class Timetable</h1>
        <p>View class schedules and lesson plans</p>
      </div>

      {/* Filters */}
      <div className="card-modern" style={{ marginBottom: "24px" }}>
        <div className="card-body">
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
              <label className="form-label">Select Class</label>
              <select 
                className="form-control"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", flexWrap: "wrap" }}>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: selectedDay === day ? "var(--primary)" : "var(--bg-secondary)",
                    color: selectedDay === day ? "white" : "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
        </div>

      {/* Timetable Grid */}
      <div className="card-modern">
        <div className="card-header">
          <h3 className="card-title">{selectedClass} - {selectedDay}</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                <th style={{ padding: "16px", textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>Time</th>
                <th style={{ padding: "16px", textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>Subject</th>
                <th style={{ padding: "16px", textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>Teacher</th>
                <th style={{ padding: "16px", textAlign: "left", borderBottom: "2px solid var(--border-color)" }}>Room</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => {
                const scheduleItem = currentSchedule[index];
                const isBreak = slot.break;
                
                return (
                  <tr 
                    key={index}
                    style={{ 
                      backgroundColor: isBreak ? "var(--bg-secondary)" : "white",
                      opacity: isBreak ? 0.7 : 1,
                    }}
                  >
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)", fontWeight: "500", color: isBreak ? "var(--text-secondary)" : "var(--text-primary)" }}>
                      {slot.time}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)" }}>
                      {isBreak ? (
                        <span style={{ color: "var(--primary)", fontWeight: "600" }}>{slot.label}</span>
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "20px" }}>📚</span>
                          {scheduleItem?.subject || "-"}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)", color: "var(--text-secondary)" }}>
                      {scheduleItem?.teacher || "-"}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--border-color)" }}>
                      {scheduleItem?.room ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", backgroundColor: "var(--primary-color-light)", borderRadius: "6px", fontSize: "13px" }}>
                          🏠 {scheduleItem.room}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      {/* Legend */}
      <div style={{ marginTop: "24px", display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "16px", height: "16px", backgroundColor: "var(--bg-secondary)", borderRadius: "4px" }}></div>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Break/Lunch</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>📚</span>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Subject</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🏠</span>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Room Number</span>
        </div>
    </div>
  );
};

export default Timetable;
