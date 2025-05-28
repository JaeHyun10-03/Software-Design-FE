import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AttendanceCalendar from "@/components/student-record/AttendanceCalendar";
import axios from "axios";

// axios를 mock 처리
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// useStudentFilterStore, useSelectedDate 같은 custom hook mock
jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: () => ({
    grade: 1,
    classNumber: 1,
    studentNumber: 1,
  }),
}));

jest.mock("@/store/selected-date-store", () => ({
  __esModule: true,
  default: () => ({
    year: 2025,
    month: 5,
  }),
}));

describe("AttendanceCalendar", () => {
  it("출결 데이터를 불러와서 달력에 표시한다", async () => {
    // mock API 응답 데이터
    const mockData = {
      response: {
        attendances: [
          { date: "2025-05-10", status: "출석" },
          { date: "2025-05-15", status: "ABSENT" },
        ],
      },
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    render(<AttendanceCalendar />);

    // 로딩 텍스트 확인
    expect(screen.getByText("출결 데이터를 불러오는 중...")).toBeInTheDocument();

    // API 호출 후 달력이 렌더링 되고 출결 심볼 표시 확인
    await waitFor(() => {
      expect(screen.queryByText("출결 데이터를 불러오는 중...")).not.toBeInTheDocument();
    });

    // 출석 표시 "O" 심볼이 표시되어야 함
    expect(screen.getAllByText("O").length).toBeGreaterThan(0);

    // 결석 표시 "X" 심볼이 표시되어야 함
    expect(screen.getAllByText("X").length).toBeGreaterThan(0);
  });

  it("API 호출 실패 시 에러 메시지 출력", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API 실패"));

    render(<AttendanceCalendar />);

    await waitFor(() => {
      expect(screen.getByText("출결 데이터를 불러오는 중 오류가 발생했습니다.")).toBeInTheDocument();
    });
  });
});
