// __tests__/attendanceContent.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AttendanceContent from "./attendanceContent";
import useSelectedDate from "@/store/selected-date-store";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";

// 모듈을 모킹
jest.mock("@/store/selected-date-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AttendanceContent", () => {
  const mockSetSelectedDate = { year: 2024, month: 5 };
  const mockSetStudentFilter = { grade: 1, classNumber: 2 };

  const mockResponseData = [
    {
      studentId: 1,
      studentName: "홍길동",
      attendances: [
        { date: "2024-05-01", status: "EARLY" },
        { date: "2024-05-02", status: "ABSENT" },
      ],
    },
  ];

  beforeEach(() => {
    (useSelectedDate as jest.Mock).mockReturnValue(mockSetSelectedDate);
    (useStudentFilterStore as jest.Mock).mockReturnValue(mockSetStudentFilter);

    mockedAxios.get.mockResolvedValue({
      data: { response: mockResponseData },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders 날짜 헤더와 학생 데이터를 표시한다", async () => {
    render(<AttendanceContent edit={false} />);
    expect(await screen.findByText("홍길동")).toBeInTheDocument();
    expect(screen.getByText("5/1")).toBeInTheDocument();
    expect(screen.getByText("△")).toBeInTheDocument();
    expect(screen.getByText("X")).toBeInTheDocument();
  });

  it("edit=true일 때 셀 클릭으로 출결 상태가 순환한다", async () => {
    render(<AttendanceContent edit={true} />);
    const cell = await screen.findByText("△");
    fireEvent.click(cell);
    expect(cell.textContent).toBe("▲");
    fireEvent.click(cell);
    expect(cell.textContent).toBe("X");
    fireEvent.click(cell);
    expect(cell.textContent).toBe("O");
    fireEvent.click(cell);
    expect(cell.textContent).toBe("△");
  });

  it("onSave 콜백이 postAttendances를 전달한다", async () => {
    const onSave = jest.fn();
    render(<AttendanceContent edit={true} onSave={onSave} />);
    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
      const saveFn = onSave.mock.calls[0][0];
      expect(typeof saveFn).toBe("function");
    });
  });

  it("출결 정보가 없을 경우 안내 메시지를 보여준다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: [] },
    });
    render(<AttendanceContent edit={false} />);
    expect(await screen.findByText("출결 조회 권한이 없습니다")).toBeInTheDocument();
  });
});
