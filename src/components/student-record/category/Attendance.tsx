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
  const [feedback, setFeedback] = useState("");
  const [feedbackId, setFeedbackId] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const token = localStorage.getItem("accessToken");

  // 출결 통계 불러오기
  useEffect(() => {
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
        console.error("올바른 학년, 반을 적용해주세요:", err);
        setError("올바른 학년, 반을 적용해주세요. 담임선생님만 학생들의 출결을 볼 수 있습니다");
      } finally {
        setIsLoading(false);
      }
    };
    getAttendancesSummary();
  }, [grade, classNumber, studentNumber, year, month, semester]);

  // 피드백 불러오기
  useEffect(() => {
    const getAttendancesFeedback = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances/feedback?year=${year}&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        setFeedback(data.feedback);
        setFeedbackId(data.feedbackId);
      } catch (err) {
        console.error("출결 피드백 조회 에러:", err);
        setFeedback(""); // 피드백 초기화
        setFeedbackId(""); // 피드백 ID 초기화
        setSaveMessage(""); // ✅ 이전 저장 메시지 제거
      }
    };
    getAttendancesFeedback();
  }, [grade, classNumber, studentNumber, year, month, semester]);

  // POST: 피드백 생성
  const postAttendancesFeedback = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances/feedback?year=${year}&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`,
        { feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data.response;
      setFeedbackId(data.feedbackId);
      setSaveMessage("피드백이 저장되었습니다.");
    } catch (err) {
      console.error("출결 피드백 등록 에러:", err);
      setSaveMessage("피드백 저장 중 오류가 발생했습니다.");
    }
  };

  // PUT: 피드백 수정
  const putAttendancesFeedback = async () => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances/feedback?year=${year}&grade=${grade}&classNum=${classNumber}&number=${studentNumber}`,
        { feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data;
      console.log("put feedback:", data);
      setSaveMessage("피드백이 수정되었습니다.");
    } catch (err) {
      console.error("출결 피드백 수정 에러:", err);
      setSaveMessage("피드백 수정 중 오류가 발생했습니다.");
    }
  };

  const handleSaveFeedback = () => {
    setSaveMessage(""); // 메시지 초기화
    if (feedbackId) {
      putAttendancesFeedback();
    } else {
      postAttendancesFeedback();
    }
  };

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
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex">
          {attendanceHeaders.map((a, index) => (
            <div className="flex flex-1 items-center justify-center h-8" key={index}>
              <Cell type="S">{a.label}</Cell>
              <Cell type="S">{a.value}</Cell>
            </div>
          ))}
        </div>
        <AttendanceCalendar />
      </div>

      <div className="flex flex-col mx-4 mt-4">
        <span className="mb-2 font-semibold">출결 피드백</span>
        <textarea className="border h-48 border-[#a9a9a9] rounded-md p-2 resize-none" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        <button className="mt-2 self-end bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSaveFeedback}>
          저장
        </button>
        {saveMessage && <p className="text-sm text-green-600 mt-1 self-end">{saveMessage}</p>}
      </div>
    </div>
  );
}
