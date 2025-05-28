import React from "react";
import { render, screen } from "@testing-library/react";
import Attendance from "@/pages/student/attendance";
import "@testing-library/jest-dom";

// ✅ mock 컴포넌트를 먼저 정의 (에러 안 남)
const MockCalendar = () => <div>Mock Calendar</div>;
MockCalendar.displayName = "MockCalendar";

const MockDateFilter = () => <div>Mock DateFilter</div>;
MockDateFilter.displayName = "MockDateFilter";

const MockCell = ({ children }: any) => <div>{children}</div>;
MockCell.displayName = "MockCell";

// ✅ 모의 컴포넌트를 등록할 때 beforeAll 내부에서 선언
beforeAll(() => {
  jest.mock("@/components/student-record/AttendanceCalendar", () => ({
    __esModule: true,
    default: MockCalendar,
  }));

  jest.mock("@/components/shared/DateFilter", () => ({
    __esModule: true,
    default: MockDateFilter,
  }));

  jest.mock("@/components/student-record/Cell", () => ({
    __esModule: true,
    default: MockCell,
  }));

  jest.mock("@/store/student-filter-store", () => () => ({
    grade: 1,
    classNumber: 1,
    studentNumber: 1,
  }));

  jest.mock("@/store/selected-date-store", () => () => ({
    year: 2024,
    month: 5,
    semester: 1,
  }));
});

// ✅ 테스트 정의
describe("Attendance Page", () => {
  test("컴포넌트가 렌더링되어야 함", () => {
    render(<Attendance />);
    expect(screen.getByText("출결 통계 데이터를 불러오는 중...")).toBeInTheDocument();
  });
});
