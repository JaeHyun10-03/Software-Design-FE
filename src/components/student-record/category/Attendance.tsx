import React from "react";
import Cell from "../Cell";
import AttendanceCalendar from "../AttendanceCalendar";

const attendanceHeaders = ["수업일수", "출석", "조퇴", "지각", "결석"];

export default function Attendance() {
  return (
    <div>
      <div className="flex">
        {attendanceHeaders.map((a, index) => {
          return <Cell key={index}>{a}</Cell>;
        })}
      </div>
      <AttendanceCalendar></AttendanceCalendar>
    </div>
  );
}
