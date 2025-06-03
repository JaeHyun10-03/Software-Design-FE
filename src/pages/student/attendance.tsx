import React, { useEffect, useState } from "react";
import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode } from "react";
import axios from "axios";
import useSelectedDate from "@/store/selected-date-store";
import Cell from "@/components/student-record/Cell";
import StudentAttendanceCalendar from "@/components/student-record/StudentAttendanceCalendar";
import DateFilter from "@/components/shared/DateFilter";
import useStudent from "@/store/student-store";

interface AttendanceSummary {
  absentDays: number;
  lateDays: number;
  leaveEarlyDays: number;
  presentDays: number;
  studentId: number;
  studentName: string;
  totalSchoolDays: number;
}

const Attendance = () => {
  const { grade, classNumber, studentNumber } = useStudent();
  const { year, month, semester } = useSelectedDate();
  const [token, setToken] = useState<string | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  // ✅ 클라이언트 환경에서만 localStorage 접근
  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 출결 통계 불러오기
  useEffect(() => {
    if (!token) return;

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
        console.error("출결 통계 오류:", err);
        setError("출결 통계를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    getAttendancesSummary();
  }, [token, grade, classNumber, studentNumber, year, month, semester]);

  // 피드백 조회만
  useEffect(() => {
    if (!token) return;

    const getAttendancesFeedback = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances/feedback?year=${year}&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedback(res.data.response.feedback);
      } catch (err) {
        console.error("출결 피드백 조회 에러:", err);
        setFeedback("");
      }
    };

    getAttendancesFeedback();
  }, [token, grade, classNumber, studentNumber, year, month, semester]);

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
    <div className="sm:m-0 m-4">
      <div className="my-4">
        <DateFilter />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          {/* 출결 통계 요약 */}
          <div className="flex flex-wrap ">
            {attendanceHeaders.map((a, index) => (
              <div className="flex flex-1 items-center justify-center h-8" key={index}>
                <Cell type="S">{a.label}</Cell>
                <Cell type="S">{a.value}</Cell>
              </div>
            ))}
          </div>

          {/* 캘린더 */}
          <StudentAttendanceCalendar />
        </div>

        {/* 피드백 읽기 전용 */}
        <div className="flex flex-col mt-8">
          <span className="mb-2 font-semibold">출결 피드백</span>
          <div className="border border-[#a9a9a9] rounded-md p-2 min-h-[12rem] whitespace-pre-line">{feedback || "피드백이 없습니다."}</div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

Attendance.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
