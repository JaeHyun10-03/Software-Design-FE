import React, { useEffect } from "react";
import Cell from "../Cell";
import AttendanceCalendar from "../AttendanceCalendar";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";

const attendanceHeaders = [
  { label: "수업일수", value: 123 },
  { label: "출석", value: 110 },
  { label: "조퇴", value: 5 },
  { label: "지각", value: 4 },
  { label: "결석", value: 3 },
];

export default function Attendance() {
  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const getAttendance = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances?year=${2025}&grade=${grade}&classNum=${classNumber}&month=${1}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.data.response;
        console.log(data);
      } catch (err) {
        console.error("출결 카테고리 API 요청 실패 : ", err);
      }
    };
    getAttendance();
  }, []);

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
