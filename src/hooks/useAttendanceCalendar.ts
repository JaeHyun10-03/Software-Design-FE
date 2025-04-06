// hooks/useAttendanceCalendar.ts (수정)
import { useMemo, useEffect } from "react";
import { getRandomWeekdayStatus, getNextStatus } from "../utils/statusUtils";
import useAttendanceStore from "@/store/attendance-store";

export type AttendanceStatus = "O" | "X" | "△" | "▲" | "-";

export type DateInfo = {
  fullDate: Date;
  date: string;
  isSunday: boolean;
  isSaturday: boolean;
  isFriday: boolean;
  isToday: boolean;
  status: AttendanceStatus;
};

export function useAttendanceCalendar(today = new Date(2025, 3, 6)) {
  const { attendanceData, setAttendanceData, updateAttendance } = useAttendanceStore();

  const generateDates = (): DateInfo[] => {
    // 기존 코드 유지
    const result: DateInfo[] = [];
    const months = [2, 3, 4, 5, 6];
    const daysInMonth = [31, 30, 31, 30, 31];

    months.forEach((month, monthIndex) => {
      for (let day = 1; day <= daysInMonth[monthIndex]; day++) {
        const date = new Date(2025, month, day);
        const dayOfWeek = date.getDay();
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;
        const isFriday = dayOfWeek === 5;
        const isWeekend = isSunday || isSaturday;

        result.push({
          fullDate: date,
          date: `${month + 1}/${day}`,
          isSunday,
          isSaturday,
          isFriday,
          isToday: date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear(),
          status: isWeekend ? "-" : getRandomWeekdayStatus(),
        });
      }
    });

    return result;
  };

  // 초기화 시 데이터 생성
  useEffect(() => {
    if (attendanceData.length === 0) {
      setAttendanceData(generateDates());
    }
  }, [attendanceData.length, setAttendanceData]);

  const updateStatus = (index: number) => {
    if (attendanceData[index] && attendanceData[index].status !== "-") {
      const nextStatus = getNextStatus(attendanceData[index].status);
      updateAttendance(index, nextStatus);
    }
  };

  const biweeks = useMemo(() => {
    if (attendanceData.length === 0) return [];

    const result: DateInfo[][] = [];
    const totalWeeks = Math.ceil(attendanceData.length / 7);
    for (let i = 0; i < totalWeeks; i += 2) {
      const twoWeeks = attendanceData.slice(i * 7, (i + 2) * 7);
      result.push(twoWeeks);
    }
    return result;
  }, [attendanceData]);

  return { biweeks, updateStatus, flatDates: attendanceData };
}
