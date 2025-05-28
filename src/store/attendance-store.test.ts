import useAttendanceStore from "./attendance-store";
import { act } from "react-dom/test-utils";

// ✅ sample date info 객체 정의
const sampleDateInfo = {
  fullDate: new Date(),
  date: "4/1",
  isToday: false,
  isSunday: false,
  isSaturday: false,
  isFriday: false,
  status: "O" as const,
};

describe("useAttendanceStore", () => {
  beforeEach(() => {
    // 상태 초기화
    const { setAttendanceData } = useAttendanceStore.getState();
    act(() => {
      setAttendanceData([]);
    });
  });

  afterEach(() => {
    // 모든 mock 함수 초기화
    jest.resetAllMocks();
  });

  it("sets attendance data", () => {
    const { setAttendanceData } = useAttendanceStore.getState();

    act(() => {
      setAttendanceData([sampleDateInfo]);
    });

    const { attendanceData: updatedData } = useAttendanceStore.getState();
    expect(updatedData).toHaveLength(1);
    expect(updatedData[0].date).toBe("4/1");
  });

  it("updates attendance status if not '-'", () => {
    const { setAttendanceData, updateAttendance } = useAttendanceStore.getState();

    act(() => {
      setAttendanceData([{ ...sampleDateInfo, status: "O" }]);
      updateAttendance(0, "X");
    });

    const updated = useAttendanceStore.getState().attendanceData[0];
    expect(updated.status).toBe("X");
  });

  it("does not update attendance status if status is '-'", () => {
    const { setAttendanceData, updateAttendance } = useAttendanceStore.getState();

    act(() => {
      setAttendanceData([{ ...sampleDateInfo, status: "-" }]);
      updateAttendance(0, "X");
    });

    const updated = useAttendanceStore.getState().attendanceData[0];
    expect(updated.status).toBe("-");
  });

  it("saves attendance via POST request", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const { setAttendanceData, saveAttendance } = useAttendanceStore.getState();

    act(() => {
      setAttendanceData([sampleDateInfo]);
    });

    const result = await saveAttendance();
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith("/api/attendance", expect.any(Object));
  });

  it("returns false if fetch fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "fail" }),
    });

    const result = await useAttendanceStore.getState().saveAttendance();
    expect(result).toBe(false);
  });
});
