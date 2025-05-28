// __tests__/components/StudentFilter.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentFilter from "@/components/shared/StudentFilter";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";
import axios from "axios";

jest.mock("@/store/student-filter-store");
jest.mock("@/store/selected-date-store");
jest.mock("axios");

const mockUseStudentFilterStore = useStudentFilterStore as unknown as jest.Mock;
const mockUseSelectedDate = useSelectedDate as unknown as jest.Mock;
const mockAxiosGet = axios.get as jest.Mock;

describe("<StudentFilter />", () => {
  const setGrade = jest.fn();
  const setClassNumber = jest.fn();
  const setStudentNumber = jest.fn();
  const setStudentId = jest.fn();
  const setStudents = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSelectedDate.mockReturnValue({
      year: "2025",
    });

    mockUseStudentFilterStore.mockReturnValue({
      grade: "1",
      classNumber: "1",
      studentNumber: "1",
      setGrade,
      setClassNumber,
      setStudentNumber,
      setStudentId,
      setStudents,
      students: [
        { studentId: "1001", number: 1, name: "홍길동" },
        { studentId: "1002", number: 2, name: "김철수" },
      ],
    });

    // getState 직접 모킹 (any 캐스팅으로 우회)
    (mockUseStudentFilterStore as any).getState = jest.fn(() => ({
      students: [
        { studentId: "1001", number: 1, name: "홍길동" },
        { studentId: "1002", number: 2, name: "김철수" },
      ],
    }));

    // localStorage mock
    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => (key === "accessToken" ? "mock-token" : null));
  });

  it("학년, 반, 번 셀렉트 박스가 렌더링 된다", () => {
    render(<StudentFilter />);
    const gradeSelect = screen.getAllByRole("combobox")[0];
    const classSelect = screen.getAllByRole("combobox")[1];
    const numberSelect = screen.getAllByRole("combobox")[2];

    expect(gradeSelect).toBeInTheDocument();
    expect(classSelect).toBeInTheDocument();
    expect(numberSelect).toBeInTheDocument();

    expect(screen.getAllByRole("option").length).toBeGreaterThan(0);
  });

  it("학년 변경 시 setGrade가 호출된다", () => {
    render(<StudentFilter />);
    const gradeSelect = screen.getAllByRole("combobox")[0];

    fireEvent.change(gradeSelect, { target: { value: "2" } });

    expect(setGrade).toHaveBeenCalledWith("2");
  });

  it("반 변경 시 setClassNumber가 호출된다", () => {
    render(<StudentFilter />);
    const classSelect = screen.getAllByRole("combobox")[1];

    fireEvent.change(classSelect, { target: { value: "3" } });

    expect(setClassNumber).toHaveBeenCalledWith("3");
  });

  it("번 변경 시 setStudentNumber, setStudentId가 호출된다", () => {
    render(<StudentFilter />);
    const numberSelect = screen.getAllByRole("combobox")[2];

    fireEvent.change(numberSelect, { target: { value: "2" } });

    expect(setStudentNumber).toHaveBeenCalledWith("2");
    expect(setStudentId).toHaveBeenCalledWith("1002");
  });

  it("grade, classNumber 변경시 학생 목록 API 호출되고 스토어 갱신된다", async () => {
    mockAxiosGet.mockResolvedValueOnce({
      data: {
        response: {
          students: [{ studentId: "1003", number: 3, name: "박영희" }],
        },
      },
    });

    render(<StudentFilter />);

    await waitFor(() => {
      expect(mockAxiosGet).toHaveBeenCalledWith(expect.stringContaining("/teachers/students"), expect.any(Object));
    });

    expect(setStudents).toHaveBeenCalledWith([{ studentId: "1003", number: 3, name: "박영희" }]);
    expect(setStudentNumber).toHaveBeenCalledWith("3");
    expect(setStudentId).toHaveBeenCalledWith("1003");
  });
});
