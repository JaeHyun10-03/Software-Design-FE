import React from "react";
import { render, screen } from "@testing-library/react";
import CounselPage from "@/pages/counsel";

// Header mock (named export)
jest.mock("@/components/shared/Header", () => ({
  __esModule: true,
  Header: ({ children }: any) => <div data-testid="header">{children}</div>,
}));

// StudentFilter mock (default export)
jest.mock("@/components/shared/StudentFilter", () => ({
  __esModule: true,
  default: () => <div data-testid="student-filter">StudentFilter</div>,
}));

// StudentList mock (default export)
jest.mock("@/components/shared/StudentList", () => ({
  __esModule: true,
  default: () => <div data-testid="student-list">StudentList</div>,
}));

// CounselContent mock (default export)
jest.mock("@/components/counsel/counselContent", () => ({
  __esModule: true,
  default: () => <div data-testid="counsel-content">CounselContent</div>,
}));

describe("<CounselPage />", () => {
  const originalInnerWidth = global.innerWidth;
  const resizeWindow = (width: number) => {
    global.innerWidth = width;
    global.dispatchEvent(new Event("resize"));
  };

  afterEach(() => {
    global.innerWidth = originalInnerWidth;
  });

  it("StudentFilter와 CounselContent는 항상 보인다", () => {
    render(<CounselPage />);
    expect(screen.getByTestId("student-filter")).toBeInTheDocument();
    expect(screen.getByTestId("counsel-content")).toBeInTheDocument();
  });

  it("화면 너비가 601px 이상이면 StudentList가 보인다", () => {
    resizeWindow(800);
    render(<CounselPage />);
    expect(screen.getByTestId("student-list")).toBeInTheDocument();
  });

  it("화면 너비가 600px 이하면 StudentList가 보이지 않는다", () => {
    resizeWindow(500);
    render(<CounselPage />);
    expect(screen.queryByTestId("student-list")).not.toBeInTheDocument();
  });

  it("getLayout 함수가 Header로 감싸서 반환한다", () => {
    const Dummy = <div>dummy</div>;
    const layout = CounselPage.getLayout(Dummy);
    const { getByTestId } = render(layout);
    expect(getByTestId("header")).toBeInTheDocument();
    expect(getByTestId("header")).toContainElement(screen.getByText("dummy"));
  });
});
