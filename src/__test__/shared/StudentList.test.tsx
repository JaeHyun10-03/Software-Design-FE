// __tests__/components/StudentList.test.tsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import StudentList from "@/components/shared/StudentList";
import useStudentFilterStore from "@/store/student-filter-store";

jest.mock("@/store/student-filter-store");

// useStudentFilterStore를 jest.Mock 타입으로 변환하기 위한 별칭
const mockUseStudentFilterStore = useStudentFilterStore as unknown as jest.Mock;

describe("<StudentList />", () => {
  const setStudentNumber = jest.fn();
  const setStudentId = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // 모킹 데이터 세팅
    mockUseStudentFilterStore.mockReturnValue({
      students: [
        { studentId: "1001", number: 1, name: "홍길동" },
        { studentId: "1002", number: 2, name: "김철수" },
      ],
      studentNumber: "1",
      setStudentNumber,
      setStudentId,
    });
  });

  it("헤더(번호, 이름)와 학생 정보가 렌더링된다", async () => {
    render(<StudentList />);

    await waitFor(() => {
      expect(screen.getByText("번호")).toBeInTheDocument();
      expect(screen.getByText("이름")).toBeInTheDocument();
      expect(screen.getByText("홍길동")).toBeInTheDocument();
      expect(screen.getByText("김철수")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("학생 클릭 시 setStudentNumber, setStudentId가 호출된다", async () => {
    render(<StudentList />);

    await waitFor(() => expect(screen.getByText("김철수")).toBeInTheDocument());

    const kim = screen.getByText("김철수");
    fireEvent.click(kim.closest("div")!);

    expect(setStudentNumber).toHaveBeenCalledWith("2");
    expect(setStudentId).toHaveBeenCalledWith("1002");
  });
});
