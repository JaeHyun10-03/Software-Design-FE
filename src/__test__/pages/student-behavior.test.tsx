import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Behavior from "@/pages/student/behavior";

// Mock 컴포넌트들
jest.mock("@/components/behavior/StudentBehaviorContent", () => {
  return function MockBehaviorContent() {
    return <div data-testid="behavior-content">Behavior Content</div>;
  };
});

jest.mock("@/components/shared/StudentHeader", () => ({
  StudentHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="student-header">{children}</div>,
}));

describe("Behavior 컴포넌트", () => {
  test("컴포넌트가 정상적으로 렌더링된다", () => {
    render(<Behavior />);

    // BehaviorContent 컴포넌트가 렌더링되는지 확인
    expect(screen.getByTestId("behavior-content")).toBeInTheDocument();
  });

  test("올바른 CSS 클래스가 적용된다", () => {
    const { container } = render(<Behavior />);

    // 최상위 div의 클래스 확인
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("h-[calc(100vh-120px)]", "flex", "flex-col", "sm:mx-8");

    // flex 컨테이너의 클래스 확인
    const flexContainer = mainDiv.querySelector(".flex.flex-row.gap-8.mt-4.flex-1");
    expect(flexContainer).toBeInTheDocument();
  });

  test("getLayout 함수가 올바르게 동작한다", () => {
    const mockPage = <div data-testid="mock-page">Test Page</div>;

    // getLayout 함수 실행
    const layoutResult = Behavior.getLayout(mockPage);

    // StudentHeader로 감싸진 결과인지 확인
    render(layoutResult);
    expect(screen.getByTestId("student-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-page")).toBeInTheDocument();
  });

  test("레이아웃 구조가 올바르게 구성된다", () => {
    const { container } = render(<Behavior />);

    // 전체 구조 확인
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.children).toHaveLength(1);

    const flexRow = mainDiv.firstChild as HTMLElement;
    expect(flexRow).toHaveClass("flex", "flex-row", "gap-8", "mt-4", "flex-1");
  });

  test("반응형 스타일이 적용된다", () => {
    const { container } = render(<Behavior />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("sm:mx-8");
  });
});

// getLayout 함수에 대한 별도 테스트
describe("Behavior.getLayout", () => {
  test("페이지를 StudentHeader로 감싼다", () => {
    const TestPage = () => <div data-testid="test-page">Test Content</div>;

    const wrappedPage = Behavior.getLayout(<TestPage />);
    render(wrappedPage);

    expect(screen.getByTestId("student-header")).toBeInTheDocument();
    expect(screen.getByTestId("test-page")).toBeInTheDocument();
  });

  test("여러 개의 자식 요소도 올바르게 처리한다", () => {
    const multipleChildren = (
      <>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </>
    );

    const wrappedPage = Behavior.getLayout(multipleChildren);
    render(wrappedPage);

    expect(screen.getByTestId("student-header")).toBeInTheDocument();
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });
});
