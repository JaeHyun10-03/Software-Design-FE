import React from "react";
import Cell from "../Cell";
import AttendanceCalendar from "../AttendanceCalendar";

const attendanceHeaders = [
  { label: "수업일수", value: 123 },
  { label: "출석", value: 110 },
  { label: "조퇴", value: 5 },
  { label: "지각", value: 4 },
  { label: "결석", value: 3 },
];

export default function Attendance() {
  return (
    <div>
      <div className="flex">
        {attendanceHeaders.map((a, index) => {
          return (
            <div className="flex flex-1 items-center justify-center h-8" key={index}>
              <Cell>{a.label}</Cell>
              <Cell>{a.value}</Cell>
            </div>
          );
        })}
      </div>
      <AttendanceCalendar />
    </div>
  );
}
