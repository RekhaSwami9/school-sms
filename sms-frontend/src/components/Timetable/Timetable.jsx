import { useState } from "react";

const Timetable = () => {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const classes = [
    "Grade 9-A",
    "Grade 9-B",
    "Grade 10-A",
    "Grade 10-B",
    "Grade 11-A",
    "Grade 12-A",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timeSlots = [
    { time: "08:00 - 08:45" },
    { time: "08:45 - 09:30" },
    { time: "09:30 - 09:45", isBreak: true, label: "Break" },
    { time: "09:45 - 10:30" },
    { time: "10:30 - 11:15" },
    { time: "11:15 - 11:30", isBreak: true, label: "Break" },
    { time: "11:30 - 12:15" },
    { time: "12:15 - 13:00" },
    { time: "13:00 - 14:00", isBreak: true, label: "Lunch" },
    { time: "14:00 - 14:45" },
    { time: "14:45 - 15:30" },
  ];

  const schedule = [
    { subject: "Mathematics", teacher: "Mrs. Smith", room: "101" },
    { subject: "Science", teacher: "Dr. Johnson", room: "102" },
    null,
    { subject: "English", teacher: "Ms. Davis", room: "103" },
    { subject: "History", teacher: "Mr. Wilson", room: "104" },
    null,
    { subject: "Art", teacher: "Mrs. Brown", room: "105" },
    { subject: "Physical Ed", teacher: "Coach Miller", room: "Gym" },
    null,
    { subject: "Computer", teacher: "Mr. Taylor", room: "Lab 1" },
    { subject: "Music", teacher: "Ms. Anderson", room: "106" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Class Timetable</h1>
        <p>View class schedules and lesson plans</p>
      </div>

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
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-end",
                flexWrap: "wrap",
              }}
            >
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor:
                      selectedDay === day
                        ? "var(--primary)"
                        : "var(--bg-secondary)",
                    color:
                      selectedDay === day ? "white" : "var(--text-primary)",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card-modern">
        <div className="card-header">
          <h3 className="card-title">
            {selectedClass} - {selectedDay}
          </h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
                <th style={{ padding: "16px", textAlign: "left" }}>Time</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Subject</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Teacher</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Room</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => {
                const item = schedule[index];
                const isBreak = slot.isBreak;

                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: isBreak
                        ? "var(--bg-secondary)"
                        : "white",
                      opacity: isBreak ? 0.7 : 1,
                    }}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: "500" }}>
                      {slot.time}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {isBreak ? (
                        <span
                          style={{ color: "var(--primary)", fontWeight: "600" }}
                        >
                          {slot.label}
                        </span>
                      ) : (
                        item?.subject || "-"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item?.teacher || "-"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {item?.room ? (
                        <span
                          style={{
                            padding: "4px 10px",
                            backgroundColor: "var(--primary-color-light)",
                            borderRadius: "6px",
                            fontSize: "13px",
                          }}
                        >
                          {item.room}
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
      </div>

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              backgroundColor: "var(--bg-secondary)",
              borderRadius: "4px",
            }}
          ></div>
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Break/Lunch
          </span>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
