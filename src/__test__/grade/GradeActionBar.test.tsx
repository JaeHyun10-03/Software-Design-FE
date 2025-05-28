// __tests__/components/GradeActionBar.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { GradeActionBar } from "@/components/grade/GradeActionBar";

// SaveButton을 mock 처리
jest.mock("@/components/grade/SaveButton", () => ({
  __esModule: true,
  SaveButton: ({ onClick }: any) => (
    <button data-testid="save-btn" onClick={onClick}>
      저장
    </button>
  ),
}));

describe("<GradeActionBar />", () => {
  it("평가방식 추가 버튼 클릭 시 onAddEval이 호출된다", () => {
    const onAddEval = jest.fn();
    const onSave = jest.fn();

    render(<GradeActionBar onAddEval={onAddEval} onSave={onSave} />);
    fireEvent.click(screen.getByText("+ 평가방식"));
    expect(onAddEval).toHaveBeenCalled();
  });

  it("저장 버튼 클릭 시 onSave가 호출된다", () => {
    const onAddEval = jest.fn();
    const onSave = jest.fn();

    render(<GradeActionBar onAddEval={onAddEval} onSave={onSave} />);
    fireEvent.click(screen.getByTestId("save-btn"));
    expect(onSave).toHaveBeenCalled();
  });
});
