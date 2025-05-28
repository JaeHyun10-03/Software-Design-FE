import React from "react";
import { render, screen } from "@testing-library/react";
import Content from "./Content";

// 하위 컴포넌트들 mock 처리
jest.mock("@/components/student-record/Category", () => ({
  __esModule: true,
  Category: () => <div>Mocked Category</div>,
}));
jest.mock("./category/StudentRecord", () => {
  function StudentRecord() {
    return <div>StudentRecord Component</div>;
  }
  return StudentRecord;
});

jest.mock("./category/Grade", () => {
  function Grade() {
    return <div>Grade Component</div>;
  }
  return Grade;
});

jest.mock("./category/Attendance", () => {
  function Attendance() {
    return <div>Attendance Component</div>;
  }
  return Attendance;
});

jest.mock("./category/Behavior", () => {
  function Behavior() {
    return <div>Behavior Component</div>;
  }
  return Behavior;
});

jest.mock("./category/Counsel", () => {
  function Counsel() {
    return <div>Counsel Component</div>;
  }
  return Counsel;
});

// useCategoryStore mock
const mockUseCategoryStore = jest.fn();

jest.mock("@/store/category-store", () => ({
  __esModule: true,
  default: () => mockUseCategoryStore(),
}));

describe("Content 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithCategory = (category: string) => {
    mockUseCategoryStore.mockReturnValue({ category });
    render(<Content />);
  };

  it("Category 컴포넌트를 항상 렌더링한다", () => {
    mockUseCategoryStore.mockReturnValue({ category: "학적" });
    render(<Content />);
    expect(screen.getByText("Mocked Category")).toBeInTheDocument();
  });

  it("category가 '학적'일 때 StudentRecord 컴포넌트를 렌더링한다", () => {
    renderWithCategory("학적");
    expect(screen.getByText("StudentRecord Component")).toBeInTheDocument();
  });

  it("category가 '성적'일 때 Grade 컴포넌트를 렌더링한다", () => {
    renderWithCategory("성적");
    expect(screen.getByText("Grade Component")).toBeInTheDocument();
  });

  it("category가 '출결'일 때 Attendance 컴포넌트를 렌더링한다", () => {
    renderWithCategory("출결");
    expect(screen.getByText("Attendance Component")).toBeInTheDocument();
  });

  it("category가 '행동'일 때 Behavior 컴포넌트를 렌더링한다", () => {
    renderWithCategory("행동");
    expect(screen.getByText("Behavior Component")).toBeInTheDocument();
  });

  it("category가 '상담'일 때 Counsel 컴포넌트를 렌더링한다", () => {
    renderWithCategory("상담");
    expect(screen.getByText("Counsel Component")).toBeInTheDocument();
  });
});
