import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import StudentRecordPage from "@/pages/student-record";
import useCategoryStore from "@/store/category-store";

// Mock 하위 컴포넌트들
function MockDateFilter() {
  return <div data-testid="date-filter" />;
}
jest.mock("@/components/shared/DateFilter", () => MockDateFilter);

function MockStudentFilter() {
  return <div data-testid="student-filter" />;
}
jest.mock("@/components/shared/StudentFilter", () => MockStudentFilter);

function MockStudentList() {
  return <div data-testid="student-list" />;
}
jest.mock("@/components/shared/StudentList", () => MockStudentList);

function MockContent() {
  return <div data-testid="content" />;
}
jest.mock("@/components/student-record/Content", () => MockContent);

function MockHeader({ children }: { children: React.ReactNode }) {
  return <div data-testid="header">{children}</div>;
}
jest.mock("@/components/shared/Header", () => MockHeader);

// useCategoryStore mock
jest.mock("@/store/category-store");

function setupBeforeEach() {
  (useCategoryStore as jest.Mock).mockReturnValue({
    category: "출결",
  });

  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 800,
  });
}

async function testRendersBasicUI() {
  render(<StudentRecordPage />);

  await waitFor(() => expect(screen.getByTestId("student-filter")).toBeInTheDocument());

  expect(screen.getByTestId("student-filter")).toBeInTheDocument();
  expect(screen.getByTestId("date-filter")).toBeInTheDocument();
  expect(screen.getByText("출석")).toBeInTheDocument();
  expect(screen.getByText("결석")).toBeInTheDocument();
  expect(screen.getByTestId("student-list")).toBeInTheDocument();
  expect(screen.getByTestId("content")).toBeInTheDocument();
}

async function testStudentListNotRenderIfNarrow() {
  window.innerWidth = 500;
  render(<StudentRecordPage />);

  await waitFor(() => expect(screen.getByTestId("student-filter")).toBeInTheDocument());

  expect(screen.queryByTestId("student-list")).not.toBeInTheDocument();
  expect(screen.getByTestId("content")).toBeInTheDocument();
}

async function testDateFilterNotRenderIfCategoryIsNotAttendance() {
  (useCategoryStore as jest.Mock).mockReturnValue({
    category: "성적",
  });

  render(<StudentRecordPage />);

  await waitFor(() => expect(screen.getByTestId("student-filter")).toBeInTheDocument());

  expect(screen.queryByTestId("date-filter")).not.toBeInTheDocument();
  expect(screen.queryByText("출석")).not.toBeInTheDocument();
}

describe("StudentRecordPage", () => {
  beforeEach(setupBeforeEach);

  it("렌더링 시 기본 UI가 잘 나타나는지", testRendersBasicUI);

  it("window.innerWidth가 600 이하일 때 StudentList가 렌더링되지 않는다", testStudentListNotRenderIfNarrow);

  it("category가 '출결'이 아닐 경우 DateFilter와 범례가 렌더링되지 않는다", testDateFilterNotRenderIfCategoryIsNotAttendance);
});
