// utils/attendanceStyles.test.ts
import { getDateTextColor, getCellStyle } from "../../hooks/attendanceStyles";

export interface DateInfo {
  date: string;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  isCurrentMonth: boolean;
}

// baseDateInfo 정의를 타입에 맞게 아래처럼 선언합니다
const baseDateInfo: DateInfo = {
  date: new Date().toISOString(), // string 타입 맞춤
  isToday: false,
  isSunday: false,
  isSaturday: false,
  isCurrentMonth: true,
};

describe("attendanceStyles utils", () => {
  describe("getDateTextColor", () => {
    it("returns green and bold for today", () => {
      const dateInfo = { ...baseDateInfo, isToday: true };
      expect(getDateTextColor(dateInfo)).toBe("font-bold text-green-600");
    });

    it("returns red for Sunday", () => {
      const dateInfo = { ...baseDateInfo, isSunday: true };
      expect(getDateTextColor(dateInfo)).toBe("text-red-500");
    });

    it("returns blue for Saturday", () => {
      const dateInfo = { ...baseDateInfo, isSaturday: true };
      expect(getDateTextColor(dateInfo)).toBe("text-blue-600");
    });

    it("returns default gray for normal day", () => {
      expect(getDateTextColor(baseDateInfo)).toBe("text-gray-800");
    });
  });

  describe("getCellStyle", () => {
    it("returns green border and bg for today", () => {
      const dateInfo = { ...baseDateInfo, isToday: true };
      expect(getCellStyle(dateInfo)).toBe("border-green-600 bg-green-50");
    });

    it("returns gray border for non-today", () => {
      expect(getCellStyle(baseDateInfo)).toBe("border-gray-400");
    });
  });
});
