// __tests__/components/GradeTableSection.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { GradeTableSection } from "@/components/grade/GradeTableSection";

// GradeTable을 mock 처리
jest.mock("@/components/grade/GradeTable", () => ({
  __esModule: true,
  GradeTable: () => <div data-testid="grade-table">GradeTable</div>,
}));

describe("<GradeTableSection />", () => {
  const baseProps = {
    subject: "수학",
    evaluations: [],
    students: [],
    editing: null,
    inputValue: "",
    selectedRow: null,
    setSelectedRow: jest.fn(),
    handleCellClick: jest.fn(),
    handleInputChange: jest.fn(),
    handleInputBlur: jest.fn(),
    handleInputKeyDown: jest.fn(),
  };

  it("allFilled가 false면 안내 메시지를 렌더링한다", () => {
    render(<GradeTableSection {...baseProps} allFilled={false} />);
    expect(screen.getByText("모든 정보를 입력해주세요.")).toBeInTheDocument();
    expect(screen.queryByTestId("grade-table")).not.toBeInTheDocument();
  });

  it("allFilled가 true면 subject와 GradeTable이 렌더링된다", () => {
    render(<GradeTableSection {...baseProps} allFilled={true} />);
    expect(screen.getByText("수학")).toBeInTheDocument();
    expect(screen.getByTestId("grade-table")).toBeInTheDocument();
  });
});
