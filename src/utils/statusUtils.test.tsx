import { getRandomWeekdayStatus, renderStatusIcon, getNextStatus } from "./statusUtils";

describe("statusUtils", () => {
  describe("getRandomWeekdayStatus", () => {
    it("returns one of the defined AttendanceStatus values", () => {
      const validStatuses = ["O", "△", "▲", "X"];
      const result = getRandomWeekdayStatus();
      expect(validStatuses).toContain(result);
    });
  });

  describe("renderStatusIcon", () => {
    it("returns the same icon as status", () => {
      expect(renderStatusIcon("O")).toBe("O");
      expect(renderStatusIcon("△")).toBe("△");
      expect(renderStatusIcon("▲")).toBe("▲");
      expect(renderStatusIcon("X")).toBe("X");
      expect(renderStatusIcon("-")).toBe("-"); // fallback/default
    });
  });

  describe("getNextStatus", () => {
    it("cycles through the status order correctly", () => {
      expect(getNextStatus("O")).toBe("△");
      expect(getNextStatus("△")).toBe("▲");
      expect(getNextStatus("▲")).toBe("X");
      expect(getNextStatus("X")).toBe("O"); // cycle back to start
    });

    it("returns 'O' for invalid input", () => {
      expect(getNextStatus("INVALID")).toBe("O");
    });
  });
});
