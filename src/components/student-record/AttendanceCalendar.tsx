import React, { useEffect, useState } from "react";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface AttendanceData {
  date: string;
  status: "EARLY" | "ABSENT" | "LATE" | "출석";
}

export default function AttendanceCalendar() {
  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  const { year, month, semester } = useSelectedDate();
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = new Date();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const getAttendances = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances/student?year=${year}&grade=${grade}&classNum=${classNumber}&number=${studentNumber}&month=${month}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data.response?.attendances || [];
        // console.log(data);
        setAttendances(data);
      } catch (err) {
        console.error("출결 카테고리 API 요청 실패 : ", err);
        setError("출결 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    getAttendances();
  }, [grade, classNumber, studentNumber, year, month]);

  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const isPastDate = (date: Date) => {
    const currentDate = new Date();
    return date < currentDate && date.getDate() !== currentDate.getDate();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const renderTileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split("T")[0];
    const attendance = attendances.find((item) => item.date === dateStr);

    let symbol = "";
    switch (attendance?.status) {
      case "출석":
        symbol = "O";
        break;
      case "ABSENT":
        symbol = "X";
        break;
      case "LATE":
        symbol = "▲";
        break;
      case "EARLY":
        symbol = "△";
        break;
      default:
        if (isPastDate(date) && date.getMonth() === month - 1 && date.getFullYear() === year && !isWeekend(date)) {
          symbol = "O";
        }
    }

    return symbol ? (
      <div className="attendance-symbol">
        <span className="text-sm font-semibold">{symbol}</span>
      </div>
    ) : null;
  };

  const getTileClassName = ({ date }: { date: Date }) => {
    const day = date.getDay();
    let classes = "";

    if (isToday(date)) {
      classes += "today ";
    }

    if (day === 0) {
      // 일요일
      classes += "sunday ";
    } else if (day === 6) {
      // 토요일
      classes += "saturday ";
    }

    return classes.trim();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 h-full">
        <p>출결 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-10 text-red-500 h-full">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="attendance-calendar-container h-full">
      <Calendar
        value={new Date(year, month - 1)}
        activeStartDate={new Date(year, month - 1)}
        locale="ko-KR"
        formatDay={(locale, date) => date.getDate().toString()}
        tileContent={renderTileContent}
        tileClassName={getTileClassName}
        showNavigation={false}
        className="h-full"
      />

      <div className="attendance-legend mt-3 flex gap-4 flex-wrap text-sm">
        <div className="flex items-center gap-1">
          <span className="font-bold">O</span> <span>출석</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold">X</span> <span>결석</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold">▲</span> <span>지각</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold">△</span> <span>조퇴</span>
        </div>
      </div>

      <style jsx global>{`
        .react-calendar {
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          width: 100%;
          height: 100%;
        }

        .react-calendar__viewContainer {
          height: 100%;
        }

        .react-calendar__month-view {
          height: 100%;
        }

        .react-calendar__month-view__days {
          height: 100%;
        }

        .react-calendar__month-view__weekdays__weekday {
          border-right: 1px solid #e5e7eb;
          padding: 0.5rem 0;
        }

        .react-calendar__month-view__weekdays__weekday:last-child {
          border-right: none;
        }

        .react-calendar__tile {
          height: 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding-top: 8px;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .react-calendar__tile:nth-child(7n) {
          border-right: none;
        }

        .react-calendar__month-view__days > .react-calendar__tile:nth-last-child(-n + 7) {
          border-bottom: none;
        }

        .attendance-symbol {
          margin-top: 4px;
        }

        .today {
          background-color: #e0f2fe !important; /* 연한 파랑 */
          border: 2px solid #3b82f6 !important;
          border-radius: 6px;
        }

        /* react-calendar 기본 스타일로 인해 월초가 파랗게 보이는 현상 제거 */
        .react-calendar abbr {
          color: inherit !important;
          text-decoration: none !important;
        }

        /* 활성화된 날짜 스타일 커스터마이징 */
        .react-calendar__tile--active {
          background: inherit !important;
          color: inherit !important;
        }

        /* 오늘 날짜 스타일 커스터마이징 (react-calendar 기본 스타일 재정의) */
        .react-calendar__tile--now {
          background: inherit !important;
          color: inherit !important;
        }

        /* 이전/다음 달 날짜 완전히 숨기기 */
        .react-calendar__month-view__days__day--neighboringMonth {
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* 토요일 파란색, 일요일 빨간색 */
        .saturday {
          color: #3b82f6 !important; /* 파란색 */
        }

        .sunday {
          color: #ef4444 !important; /* 빨간색 */
        }

        /* 요일 헤더 색상 설정 */
        .react-calendar__month-view__weekdays__weekday:nth-child(6) abbr {
          color: #3b82f6 !important; /* 토요일 헤더 파란색 */
        }

        .react-calendar__month-view__weekdays__weekday:nth-child(7) abbr {
          color: #ef4444 !important; /* 일요일 헤더 빨간색 */
        }
      `}</style>
    </div>
  );
}
