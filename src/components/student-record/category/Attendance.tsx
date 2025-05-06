import React, { useEffect, useState } from "react";
import Cell from "../Cell";
import AttendanceCalendar from "../AttendanceCalendar";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";

interface AttendanceSummary {
  absentDays: number;
  lateDays: number;
  leaveEarlyDays: number;
  presentDays: number;
  studentId: number;
  studentName: string;
  totalSchoolDays: number;
}

export default function Attendance() {
  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  const { year, month, semester } = useSelectedDate();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const getAttendancesSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances/summary?year=${year}&semester=${semester}&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSummary(res.data.response);
      } catch (err) {
        console.error("출결 통계 데이터 조회 오류:", err);
        setError("출결 통계 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    getAttendancesSummary();
  }, [grade, classNumber, studentNumber, year, month, semester]);

  const attendanceHeaders = [
    { label: "수업일수", value: summary?.totalSchoolDays || 0 },
    { label: "출석", value: summary?.presentDays || 0 },
    { label: "조퇴", value: summary?.leaveEarlyDays || 0 },
    { label: "지각", value: summary?.lateDays || 0 },
    { label: "결석", value: summary?.absentDays || 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p>출결 통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex">
        {attendanceHeaders.map((a, index) => {
          return (
            <div className="flex flex-1 items-center justify-center h-8" key={index}>
              <Cell type="small">{a.label}</Cell>
              <Cell type="small">{a.value}</Cell>
            </div>
          );
        })}
      </div>
      <AttendanceCalendar />
    </div>
  );
}
