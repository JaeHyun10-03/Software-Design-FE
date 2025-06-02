// src/pages/behavior/index.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import BehaviorPage from "@/pages/behavior/index";

// Mock 컴포넌트들 (이전과 동일)
jest.mock("@/components/behavior/BehaviorContent", () => {
  return function MockBehaviorContent() {
    return <div data-testid="behavior-content">BehaviorContent</div>;
  };
});

jest.mock("@/components/shared/DateFilter", () => {
  return function MockDateFilter() {
    return <div data-testid="date-filter">DateFilter</div>;
  };
});

jest.mock("@/components/shared/StudentFilter", () => {
  return function MockStudentFilter() {
    return <div data-testid="student-filter">StudentFilter</div>;
  };
});

jest.mock("@/components/shared/StudentList", () => {
  return function MockStudentList() {
    return <div data-testid="student-list">StudentList</div>;
  };
});

jest.mock("@/components/shared/Header", () => ({
  Header: function MockHeader({ children }: any) {
    return <div data-testid="header">{children}</div>;
  },
}));

describe("BehaviorPage", () => {
  it("모든 컴포넌트가 렌더링된다", () => {
    render(<BehaviorPage />);

    expect(screen.getByTestId("student-filter")).toBeInTheDocument();
    expect(screen.getByTestId("date-filter")).toBeInTheDocument();
    expect(screen.getByTestId("student-list")).toBeInTheDocument();
    expect(screen.getByTestId("behavior-content")).toBeInTheDocument();
  });

  it("올바른 레이아웃 구조를 가진다", () => {
    const { container } = render(<BehaviorPage />);

    // 메인 컨테이너 확인
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass("mt-4", "mb-8", "flex", "flex-col");

    // 필터 섹션 확인 - 클래스 선택자 수정
    const filterSection = container.querySelector(".flex.flex-col.gap-3.sm\\:flex-row");
    expect(filterSection).toBeInTheDocument();

    // 콘텐츠 섹션 확인
    const contentSection = container.querySelector(".flex-row.gap-8");
    expect(contentSection).toBeInTheDocument();
  });

  it("StudentList가 sm 이상에서만 표시되도록 hidden 클래스가 적용된다", () => {
    const { container } = render(<BehaviorPage />);

    const studentListContainer = container.querySelector(".hidden.sm\\:flex");
    expect(studentListContainer).toBeInTheDocument();
  });
});
