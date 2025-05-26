// __tests__/components/StudentFilter.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StudentFilter from "@/components/shared/StudentFilter";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";

// zustand store mock
jest.mock("@/store/student-filter-store");
// axios mock
jest.mock("axios");

describe("<StudentFilter />", () => {
  const setGrade = jest.fn();
  const setClassNumber = jest.fn();
  const setStudentNumber = jest.fn();
  const setStudentId = jest.fn();

 beforeEach(() => {
  jest.clearAllMocks();
  // store mock 리턴값 설정
  ((useStudentFilterStore as unknown) as jest.Mock).mockReturnValue({
    grade: "1",
    classNumber: "2",
    studentNumber: "3",
    setGrade,
    setClassNumber,
    setStudentNumber,
    setStudentId,
  });
  // localStorage mock
  Storage.prototype.getItem = jest.fn(() => "mock-token");
});


  it("학년/반/번호 셀렉트와 라벨이 모두 보인다", () => {
    render(<StudentFilter />);
    expect(screen.getByText("학년")).toBeInTheDocument();
    expect(screen.getByText("반")).toBeInTheDocument();
    expect(screen.getByText("번")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")).toHaveLength(3);
  });

 it("각 셀렉트박스에 올바른 옵션이 보인다", () => {
  render(<StudentFilter />);
  const selects = screen.getAllByRole("combobox");
  // 학년 셀렉트
  expect(selects[0].querySelector('option[value="1"]')).toBeInTheDocument();
  expect(selects[0].querySelector('option[value="2"]')).toBeInTheDocument();
  expect(selects[0].querySelector('option[value="3"]')).toBeInTheDocument();
  // 반 셀렉트
  expect(selects[1].querySelector('option[value="10"]')).toBeInTheDocument();
  // 번호 셀렉트
  expect(selects[2].querySelector('option[value="30"]')).toBeInTheDocument();
});


  it("학년/반/번호 변경 시 각각 setGrade/setClassNumber/setStudentNumber가 호출된다", () => {
    render(<StudentFilter />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "2" } });
    expect(setGrade).toHaveBeenCalledWith("2");
    fireEvent.change(selects[1], { target: { value: "5" } });
    expect(setClassNumber).toHaveBeenCalledWith("5");
    fireEvent.change(selects[2], { target: { value: "10" } });
    expect(setStudentNumber).toHaveBeenCalledWith("10");
  });

  it("학년/반/번호가 모두 선택되면 학생 정보 API를 호출하고, setStudentId가 호출된다", async () => {
    // axios 응답 mock
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        response: {
          students: [
            { number: 1, studentId: 1001 },
            { number: 3, studentId: 1003 }, // studentNumber: "3"일 때 매칭
          ],
        },
      },
    });

    render(<StudentFilter />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/teachers/students"),
        expect.objectContaining({
          headers: { Authorization: "Bearer mock-token" },
        })
      );
      expect(setStudentId).toHaveBeenCalledWith(1003);
    });
  });

  it("학생 정보가 없으면 setStudentId가 호출되지 않고, 콘솔 경고가 발생한다", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        response: {
          students: [{ number: 1, studentId: 1001 }],
        },
      },
    });

    render(<StudentFilter />);
    await waitFor(() => {
      expect(setStudentId).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith("해당 학생을 찾을 수 없습니다.");
    });
    warnSpy.mockRestore();
  });

  it("API 호출 실패시 콘솔 에러가 발생한다", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API 실패"));

    render(<StudentFilter />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "학생 정보 가져오기 실패:",
        expect.any(Error)
      );
    });
    errorSpy.mockRestore();
  });
});
