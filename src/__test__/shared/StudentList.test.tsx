// __tests__/components/StudentList.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import StudentList from "@/components/shared/StudentList";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";
import axios from "axios";

// zustand store mock
jest.mock("@/store/student-filter-store");
jest.mock("@/store/selected-date-store");
jest.mock("axios");

describe("<StudentList />", () => {
  const setStudentFilter = jest.fn();
  const setStudentNumber = jest.fn();
  const setStudentId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // store mock 리턴값 설정
    (useStudentFilterStore as unknown as jest.Mock).mockReturnValue({
      grade: "1",
      classNumber: "2",
      studentNumber: "3",
      setStudentNumber,
      setStudentId,
    });
    (useStudentFilterStore as unknown as any).setState = setStudentFilter;
    (useSelectedDate as unknown as jest.Mock).mockReturnValue({ year: "2025" });
    Storage.prototype.getItem = jest.fn(() => "mock-token");
  });

  it("헤더(번호, 이름)와 학생 정보가 렌더링된다", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        response: {
          grade: "1",
          classNum: "2",
          students: [
            { studentId: "1001", number: 1, name: "홍길동" },
            { studentId: "1002", number: 2, name: "김철수" },
          ],
        },
      },
    });

    render(<StudentList />);

    // 학생 정보가 비동기로 로딩되므로 waitFor 사용
    await waitFor(() => {
      expect(screen.getByText("번호")).toBeInTheDocument();
      expect(screen.getByText("이름")).toBeInTheDocument();
      expect(screen.getByText("홍길동")).toBeInTheDocument();
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("학생 정보가 없으면 '학생 정보가 없습니다'가 보인다", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        response: {
          grade: "1",
          classNum: "2",
          students: [],
        },
      },
    });

    render(<StudentList />);
    await waitFor(() => {
      expect(screen.getByText("학생 정보가 없습니다")).toBeInTheDocument();
    });
  });

  it("학생을 클릭하면 setStudentNumber, setStudentId가 호출된다", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        response: {
          grade: "1",
          classNum: "2",
          students: [
            { studentId: "1001", number: 1, name: "홍길동" },
            { studentId: "1002", number: 2, name: "김철수" },
          ],
        },
      },
    });

    render(<StudentList />);
    await waitFor(() => {
      expect(screen.getByText("홍길동")).toBeInTheDocument();
    });

    // "김철수" 학생을 클릭
    const kim = screen.getByText("김철수");
    fireEvent.click(kim.closest("div")!);
    expect(setStudentNumber).toHaveBeenCalledWith("2");
    expect(setStudentId).toHaveBeenCalledWith("1002");
  });

  it("API 실패시 콘솔 에러가 발생한다", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API 실패"));

    render(<StudentList />);
    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith(
        "학생 목록 가져오기 오류:",
        expect.any(Error)
      );
    });
    errorSpy.mockRestore();
  });

  it("API 호출 시 setStudentFilter가 올바른 값으로 호출된다", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        response: {
          grade: "1",
          classNum: "2",
          students: [
            { studentId: "1001", number: 1, name: "홍길동" },
            { studentId: "1002", number: 2, name: "김철수" },
          ],
        },
      },
    });

    render(<StudentList />);
    await waitFor(() => {
      expect(setStudentFilter).toHaveBeenCalledWith({
        grade: "1",
        classNumber: "2",
        studentNumber: "1",
        studentId: "1001",
        isReady: true,
      });
    });
  });
});
