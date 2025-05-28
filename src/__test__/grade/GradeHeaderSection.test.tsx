// __tests__/components/GradeHeaderSection.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { GradeHeaderSection } from "@/components/grade/GradeHeaderSection";

// StudentFilter와 GradeFilter를 mock 처리
jest.mock("@/components/shared/StudentFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="student-filter">StudentFilter</div>,
}));
jest.mock("@/components/grade/GradeFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="grade-filter">GradeFilter</div>,
}));

describe("<GradeHeaderSection />", () => {
  it("StudentFilter와 GradeFilter가 렌더링된다", () => {
    render(<GradeHeaderSection />);
    expect(screen.getByTestId("student-filter")).toBeInTheDocument();
    expect(screen.getByTestId("grade-filter")).toBeInTheDocument();
  });
});
