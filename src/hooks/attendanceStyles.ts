// utils/attendanceStyles.ts
import { DateInfo } from "../hooks/useAttendanceCalendar";

export function getDateTextColor(dateInfo: DateInfo): string {
  if (dateInfo.isToday) return "font-bold text-green-600";
  if (dateInfo.isSunday) return "text-red-500";
  if (dateInfo.isSaturday) return "text-blue-600";
  return "text-gray-800";
}

export function getCellStyle(dateInfo: DateInfo): string {
  return dateInfo.isToday ? "border-green-600 bg-green-50" : "border-gray-400";
}
