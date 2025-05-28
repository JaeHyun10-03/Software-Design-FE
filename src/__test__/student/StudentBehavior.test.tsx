// __tests__/pages/StudentBehavior.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Behavior from "@/pages/student/behavior";

// BehaviorContent mock (default export)
jest.mock("@/components/behavior/StudentBehaviorContent", () => ({
  __esModule: true,
  default: () => <div data-testid="behavior-content">BehaviorContent</div>,
}));

// StudentHeader mock (named export)
jest.mock("@/components/shared/StudentHeader", () => ({
  __esModule: true,
  StudentHeader: ({ children }: any) => <div data-testid="student-header">{children}</div>,
}));

describe("<Behavior />", () => {
  it("BehaviorContent가 렌더링된다", () => {
    render(<Behavior />);
    expect(screen.getByTestId("behavior-content")).toBeInTheDocument();
  });

  it("getLayout 함수가 StudentHeader로 감싸서 반환한다", () => {
    const Dummy = <div>dummy</div>;

    const layout = Behavior.getLayout(Dummy);
    const { getByTestId } = render(layout);
    expect(getByTestId("student-header")).toBeInTheDocument();
    expect(getByTestId("student-header")).toContainElement(screen.getByText("dummy"));
  });
});
