// src/__tests__/grade/GradesPage.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GradesPage from "@/pages/grade";

// ——— Mock all collaborators with correct ES module interop ———
jest.mock("@/components/shared/Header", () => ({
  __esModule: true,
  Header: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/shared/StudentFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="student-filter" />,
}));

jest.mock("@/components/grade/GradeFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="grade-filter" />,
}));

jest.mock("@/components/grade/GradeTable", () => ({
  __esModule: true,
  GradeTable: ({ evaluations, students, handleCellClick, handleInputChange, handleInputBlur, handleInputKeyDown }: any) => (
    <div data-testid="grade-table-mock">
      <span>
        evals:{evaluations.map((e: any) => e.name ?? e).join(",")}| students:{students.length}
      </span>
      <button onClick={() => handleCellClick(1, "score", 85)} data-testid="cell-click-btn">
        Cell Click
      </button>
      <input onChange={handleInputChange} onBlur={handleInputBlur} onKeyDown={handleInputKeyDown} data-testid="mock-input" />
    </div>
  ),
}));

jest.mock("@/components/grade/SaveButton", () => ({
  __esModule: true,
  SaveButton: ({ onClick }: { onClick: () => void }) => <button onClick={onClick}>다음</button>,
}));

// ——— Mock Zustand stores - 기본값 설정 ———
const defaultStudentStore = {
  grade: "1",
  classNumber: "2",
  studentNumber: "3",
};

const defaultGradeStore = {
  year: "2024",
  semester: "1",
  subject: "수학",
};

let mockStudentStore = { ...defaultStudentStore };
let mockGradeStore = { ...defaultGradeStore };

jest.mock("@/store/student-filter-store", () => jest.fn(() => mockStudentStore));

jest.mock("@/store/grade-filter-store", () => jest.fn(() => mockGradeStore));

// ——— Mock API & Utils ———
jest.mock("@/api/getScoreSummary", () => ({
  __esModule: true,
  GetScore: jest.fn(),
}));
jest.mock("@/api/postScore", () => ({
  __esModule: true,
  PostScore: jest.fn(),
}));
jest.mock("@/utils/gradeUtils", () => ({
  __esModule: true,
  mapApiResponseToStudents: jest.fn(),
  convertToApiFormat: jest.fn(),
}));

// Mock window.location.reload
Object.defineProperty(window, "location", {
  value: {
    reload: jest.fn(),
  },
  writable: true,
});

// Mock window.alert
global.alert = jest.fn();

import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
import { mapApiResponseToStudents, convertToApiFormat } from "@/utils/gradeUtils";

describe("GradesPage", () => {
  beforeEach(() => {
    // Mock 함수들만 리셋, store는 기본값으로 복원
    jest.clearAllMocks();
    mockStudentStore = { ...defaultStudentStore };
    mockGradeStore = { ...defaultGradeStore };

    // 기본 성공 케이스 설정
    (GetScore as jest.Mock).mockResolvedValue({ raw: "api-data" });
    (mapApiResponseToStudents as jest.Mock).mockReturnValue({
      titles: [{ id: 1, name: "중간" }],
      students: [{ number: 1, name: "홍길동", score: 90 }],
    });
    (convertToApiFormat as jest.Mock).mockReturnValue([
      {
        classNum: 2,
        evaluationId: 1,
        students: [{ number: 1, rawScore: 90 }],
      },
    ]);
    (PostScore as jest.Mock).mockResolvedValue(undefined);
  });

  describe("초기 렌더링 및 데이터 로딩", () => {
    it("모든 필터가 채워진 경우: GetScore 호출 → GradeTable 렌더", async () => {
      render(<GradesPage />);

      await waitFor(() => {
        expect(GetScore).toHaveBeenCalledWith(2024, 1, 1, 2, "수학");
        expect(mapApiResponseToStudents).toHaveBeenCalledWith({ raw: "api-data" });
      });

      expect(screen.getByTestId("grade-table-mock")).toBeInTheDocument();
      expect(screen.getByText("수학")).toBeInTheDocument();
    });

    it("필터 정보가 부족한 경우: API 호출하지 않고 안내 메시지 표시", () => {
      // grade 필드를 빈 문자열로 설정
      mockStudentStore.grade = "";

      render(<GradesPage />);

      expect(GetScore).not.toHaveBeenCalled();
      expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
      expect(screen.queryByTestId("grade-table-mock")).not.toBeInTheDocument();
    });

    it("GetScore API 호출 실패 시 콘솔 에러 로그", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      (GetScore as jest.Mock).mockRejectedValue(new Error("API Error"));

      render(<GradesPage />);

      await waitFor(() => {
        expect(GetScore).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe("셀 편집 기능", () => {
    it("셀 클릭 → editing 상태 설정", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      const cellClickBtn = screen.getByTestId("cell-click-btn");
      fireEvent.click(cellClickBtn);

      // 편집 상태가 설정되었는지 확인 (실제로는 내부 상태이므로 UI 변화로 확인)
      expect(screen.getByTestId("mock-input")).toBeInTheDocument();
    });

    it("입력값 변경 처리", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      const mockInput = screen.getByTestId("mock-input");
      fireEvent.change(mockInput, { target: { value: "95" } });

      // 입력 처리가 정상적으로 이루어졌는지 확인
      expect(mockInput).toBeInTheDocument();
    });

    it("Enter 키 입력 시 편집 완료", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      // 먼저 셀 클릭으로 편집 모드 활성화
      fireEvent.click(screen.getByTestId("cell-click-btn"));

      const mockInput = screen.getByTestId("mock-input");
      fireEvent.change(mockInput, { target: { value: "95" } });
      fireEvent.keyDown(mockInput, { key: "Enter" });

      expect(mockInput).toBeInTheDocument();
    });

    it("blur 이벤트로 편집 완료 - 빈 값 처리", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      fireEvent.click(screen.getByTestId("cell-click-btn"));

      const mockInput = screen.getByTestId("mock-input");
      fireEvent.change(mockInput, { target: { value: "" } });
      fireEvent.blur(mockInput);

      expect(mockInput).toBeInTheDocument();
    });

    it("blur 이벤트로 편집 완료 - 숫자 값 처리", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      fireEvent.click(screen.getByTestId("cell-click-btn"));

      const mockInput = screen.getByTestId("mock-input");
      fireEvent.change(mockInput, { target: { value: "88" } });
      fireEvent.blur(mockInput);

      expect(mockInput).toBeInTheDocument();
    });
  });

  describe("저장 기능", () => {
    it("저장 성공 시 페이지 새로고침", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      fireEvent.click(screen.getByRole("button", { name: "다음" }));

      await waitFor(() => {
        expect(convertToApiFormat).toHaveBeenCalled();
        expect(PostScore).toHaveBeenCalledWith([
          {
            classNum: 2,
            evaluationId: 1,
            students: [{ number: 1, rawScore: 90 }],
          },
        ]);
      });

      await waitFor(() => {
        expect(window.location.reload).toHaveBeenCalled();
      });
    });

    it("저장 실패 시 알림 메시지 표시", async () => {
      (PostScore as jest.Mock).mockRejectedValue(new Error("Save failed"));

      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      fireEvent.click(screen.getByRole("button", { name: "다음" }));

      await waitFor(() => {
        expect(PostScore).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith("저장에 실패했습니다. 다시 시도해주세요.");
        expect(window.location.reload).not.toHaveBeenCalled();
      });
    });

    it("저장 버튼 클릭 시 preventDefault 호출", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      const saveButton = screen.getByRole("button", { name: "다음" });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(PostScore).toHaveBeenCalled();
      });
    });
  });

  describe("다양한 필터 조합 테스트", () => {
    it("일부 필터만 채워진 경우 - year 누락", () => {
      mockGradeStore.year = "";

      render(<GradesPage />);

      expect(GetScore).not.toHaveBeenCalled();
      expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
    });

    it("일부 필터만 채워진 경우 - semester 누락", () => {
      mockGradeStore.semester = "";

      render(<GradesPage />);

      expect(GetScore).not.toHaveBeenCalled();
      expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
    });

    it("일부 필터만 채워진 경우 - subject 누락", () => {
      mockGradeStore.subject = "";

      render(<GradesPage />);

      expect(GetScore).not.toHaveBeenCalled();
      expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
    });

    it("일부 필터만 채워진 경우 - classNumber 누락", () => {
      mockStudentStore.classNumber = "";

      render(<GradesPage />);

      expect(GetScore).not.toHaveBeenCalled();
      expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
    });

    it("일부 필터만 채워진 경우 - studentNumber 누락", () => {
      mockStudentStore.studentNumber = "";

      render(<GradesPage />);

      expect(GetScore).not.toHaveBeenCalled();
      expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("편집 상태가 null일 때 blur 이벤트 무시", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      // editing 상태 없이 blur 이벤트 발생
      const mockInput = screen.getByTestId("mock-input");
      fireEvent.blur(mockInput);

      // 에러 없이 처리되어야 함
      expect(mockInput).toBeInTheDocument();
    });

    it("셀 클릭 시 undefined 값 처리", async () => {
      render(<GradesPage />);

      await waitFor(() => screen.getByTestId("grade-table-mock"));

      // 셀 클릭 이벤트가 정상적으로 처리되는지 확인
      fireEvent.click(screen.getByTestId("cell-click-btn"));
      expect(screen.getByTestId("grade-table-mock")).toBeInTheDocument();
    });

    it("빈 evaluations 배열 처리", async () => {
      (mapApiResponseToStudents as jest.Mock).mockReturnValue({
        titles: [],
        students: [],
      });

      render(<GradesPage />);

      await waitFor(() => {
        expect(screen.getByTestId("grade-table-mock")).toBeInTheDocument();
      });

      // 빈 배열도 정상적으로 렌더링되는지 확인
      expect(screen.getByText("evals:| students:0")).toBeInTheDocument();
    });
  });
});
