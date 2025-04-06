// store/attendance-store.ts
import { create } from "zustand";
import { DateInfo } from "@/hooks/useAttendanceCalendar";

interface AttendanceState {
  attendanceData: DateInfo[];
  setAttendanceData: (data: DateInfo[]) => void;
  updateAttendance: (index: number, status: string) => void;
  saveAttendance: () => Promise<boolean>;
}

const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendanceData: [],
  setAttendanceData: (data) => set({ attendanceData: data }),
  updateAttendance: (index, status) => {
    set((state) => {
      const updated = [...state.attendanceData];
      if (updated[index] && updated[index].status !== "-") {
        updated[index] = {
          ...updated[index],
          status: status as any,
        };
      }
      return { attendanceData: updated };
    });
  },
  saveAttendance: async () => {
    try {
      // API 요청 코드
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          attendance: get().attendanceData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save attendance");
      }

      return true;
    } catch (error) {
      console.error("Error saving attendance:", error);
      return false;
    }
  },
}));

export default useAttendanceStore;
