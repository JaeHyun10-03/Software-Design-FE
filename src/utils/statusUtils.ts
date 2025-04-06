// utils/statusUtils.ts
import { AttendanceStatus } from "@/hooks/useAttendanceCalendar";

export function getRandomWeekdayStatus(): AttendanceStatus {
  const pool: AttendanceStatus[] = ["O", "O", "O", "△", "△", "▲", "X"];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function renderStatusIcon(status: AttendanceStatus): string {
  switch (status) {
    case "O":
      return "O";
    case "△":
      return "△";
    case "▲":
      return "▲";
    case "X":
      return "X";
    default:
      return "-";
  }
}

export const getNextStatus = (status: string): string => {
  const statusOrder = ["O", "△", "▲", "X"];
  const index = statusOrder.indexOf(status);
  return statusOrder[(index + 1) % statusOrder.length] || "O";
};
