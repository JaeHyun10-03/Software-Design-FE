// src/hooks/__tests__/useAttendanceCalendar.test.tsx
import React from "react";
import { render, act } from "@testing-library/react";
import useAttendanceStore from "@/store/attendance-store";
import { useAttendanceCalendar, AttendanceStatus } from "@/hooks/useAttendanceCalendar";

jest.mock("@/store/attendance-store");
const mockSetAttendanceData = jest.fn();
const mockUpdateAttendance = jest.fn();

jest.mock("@/utils/statusUtils", () => ({
  getRandomWeekdayStatus: jest.fn(() => "O"),
  getNextStatus: jest.fn((status: AttendanceStatus) => {
    const statuses: AttendanceStatus[] = ["O", "X", "△", "▲"];
    const currentIndex = statuses.indexOf(status);
    return statuses[(currentIndex + 1) % statuses.length];
  }),
}));

// 그리고 spyOn 부분 삭제!

(useAttendanceStore as jest.Mock).mockReturnValue({
  attendanceData: [],
  setAttendanceData: mockSetAttendanceData,
  updateAttendance: mockUpdateAttendance,
});

// 테스트용 컴포넌트
function TestComponent({ today }: { today: Date }) {
  const { biweeks, updateStatus, flatDates } = useAttendanceCalendar(today);

  return (
    <div>
      <div data-testid="biweeks-count">{biweeks.length}</div>
      <div data-testid="flatDates-count">{flatDates.length}</div>
      <button data-testid="update-status-btn" onClick={() => updateStatus(0)}>
        Update Status
      </button>
      <div data-testid="first-date-status">{flatDates[0]?.status || "none"}</div>
    </div>
  );
}

describe("useAttendanceCalendar with React Testing Library", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기화 시 setAttendanceData 호출 및 날짜 생성", () => {
    render(<TestComponent today={new Date(2025, 3, 6)} />);
    expect(mockSetAttendanceData).toHaveBeenCalled();
  });

  it("updateStatus 호출 시 updateAttendance 실행", () => {
    // attendanceData에 status가 "-"가 아닌 첫 아이템 넣기 위해 mock을 다시 지정
    (useAttendanceStore as jest.Mock).mockReturnValue({
      attendanceData: [
        {
          fullDate: new Date(2025, 3, 7),
          date: "4/7",
          isSunday: false,
          isSaturday: false,
          isFriday: false,
          isToday: false,
          status: "O",
        },
      ],
      setAttendanceData: mockSetAttendanceData,
      updateAttendance: mockUpdateAttendance,
    });

    const { getByTestId } = render(<TestComponent today={new Date(2025, 3, 6)} />);

    act(() => {
      getByTestId("update-status-btn").click();
    });

    expect(mockUpdateAttendance).toHaveBeenCalledWith(0, "X");
  });

  it("updateStatus 호출 시 status가 '-'면 updateAttendance 미호출", () => {
    (useAttendanceStore as jest.Mock).mockReturnValue({
      attendanceData: [
        {
          fullDate: new Date(2025, 3, 5),
          date: "4/5",
          isSunday: false,
          isSaturday: true,
          isFriday: false,
          isToday: false,
          status: "-",
        },
      ],
      setAttendanceData: mockSetAttendanceData,
      updateAttendance: mockUpdateAttendance,
    });

    const { getByTestId } = render(<TestComponent today={new Date(2025, 3, 6)} />);

    act(() => {
      getByTestId("update-status-btn").click();
    });

    expect(mockUpdateAttendance).not.toHaveBeenCalled();
  });

  it("biweeks가 2주 단위로 나뉘어 반환되는지 확인", () => {
    // 14일치 데이터 배열 생성
    const days = Array.from({ length: 14 }, (_, i) => ({
      fullDate: new Date(2025, 3, i + 1),
      date: `4/${i + 1}`,
      isSunday: false,
      isSaturday: false,
      isFriday: false,
      isToday: false,
      status: "O" as AttendanceStatus,
    }));

    (useAttendanceStore as jest.Mock).mockReturnValue({
      attendanceData: days,
      setAttendanceData: mockSetAttendanceData,
      updateAttendance: mockUpdateAttendance,
    });

    const { getByTestId } = render(<TestComponent today={new Date(2025, 3, 6)} />);
    expect(getByTestId("biweeks-count").textContent).toBe("1"); // 14일 = 2주씩 나누면 1묶음
    expect(getByTestId("flatDates-count").textContent).toBe("14");
  });
});
