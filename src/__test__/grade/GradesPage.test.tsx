// src/__tests__/grade/GradesPage.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GradesPage from "@/pages/grade";

// ——— Mock all collaborators with correct ES module interop ———
// 1) Header (not used in render but safe to mock)
jest.mock("@/components/shared/Header", () => ({
  __esModule: true,
  Header: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// 2) StudentFilter (default export)
jest.mock("@/components/shared/StudentFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="student-filter" />,
}));

// 3) GradeFilter (default export)
jest.mock("@/components/grade/GradeFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="grade-filter" />,
}));

// 4) GradeTable (named export)
jest.mock("@/components/grade/GradeTable", () => ({
  __esModule: true,
  GradeTable: ({ evaluations, students }: any) => (
    <div data-testid="grade-table-mock">
      evals:{evaluations.map((e: any) => e.name ?? e).join(",")}
      | students:{students.length}
    </div>
  ),
}));

// 5) SaveButton (named export)
jest.mock("@/components/grade/SaveButton", () => ({
  __esModule: true,
  SaveButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>다음</button>
  ),
}));

// ——— Mock Zustand stores ———
jest.mock("@/store/student-filter-store", () => () => ({
  grade: "1",
  classNumber: "2",
  studentNumber: "3",
}));
jest.mock("@/store/grade-filter-store", () => () => ({
  year: "2024",
  semester: "1",
  subject: "수학",
}));

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

import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
import {
  mapApiResponseToStudents,
  convertToApiFormat,
} from "@/utils/gradeUtils";

describe("GradesPage", () => {
  beforeEach(() => {
    // 1) GetScore resolves with mock API data
    (GetScore as jest.Mock).mockResolvedValue({ raw: "api-data" });

    // 2) mapApiResponseToStudents returns known titles & students
    (mapApiResponseToStudents as jest.Mock).mockReturnValue({
      titles: [{ id: 1, name: "중간" }],
      students: [{ number: 1, name: "홍길동", score: 90 }],
    });

    // 3) convertToApiFormat returns payload matching API spec
    (convertToApiFormat as jest.Mock).mockReturnValue([
      {
        classNum: 2,
        evaluationId: 1,
        students: [{ number: 1, rawScore: 90 }],
      },
    ]);

    // 4) PostScore resolves without error
    (PostScore as jest.Mock).mockResolvedValue(undefined);
  });

  it("마운트 시 GetScore → mapApiResponseToStudents가 호출되고, GradeTable이 렌더된다", async () => {
    render(<GradesPage />);

    await waitFor(() => {
      // GetScore가 올바른 인자로 호출됐는지
      expect(GetScore).toHaveBeenCalledWith(2024, 1, 1, 2, "수학");

      // mapApiResponseToStudents가 GetScore 결과로 호출됐는지
      expect(mapApiResponseToStudents).toHaveBeenCalledWith({ raw: "api-data" });

      // stubbed GradeTable 표시 확인
      expect(screen.getByTestId("grade-table-mock")).toBeInTheDocument();
    });
  });

  it("‘다음’ 버튼 클릭 시 convertToApiFormat → PostScore 호출", async () => {
    render(<GradesPage />);

    // GradeTable이 렌더될 때까지 기다림
    await waitFor(() => screen.getByTestId("grade-table-mock"));

    // 저장(다음) 버튼 클릭
    fireEvent.click(screen.getByRole("button", { name: "다음" }));

    await waitFor(() => {
      // convertToApiFormat 호출 확인
      expect(convertToApiFormat).toHaveBeenCalled();

      // PostScore에 올바른 payload 전달 확인
      expect(PostScore).toHaveBeenCalledWith([
        {
          classNum: 2,
          evaluationId: 1,
          students: [{ number: 1, rawScore: 90 }],
        },
      ]);
    });
  });
});
