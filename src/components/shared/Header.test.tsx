import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/shared/Header";
import { useRouter } from "next/router";
import useLoginStore from "@/store/login-store"; // Adjust the import path as needed

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock the login store
jest.mock("@/store/login-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Header", () => {
  const mockPush = jest.fn();
  const mockPathname = "/student-record"; // Default active path for tests

  beforeEach(() => {
    // Reset mocks before each test
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      pathname: mockPathname,
    });
    (useLoginStore as unknown as jest.Mock).mockReturnValue({
      name: "테스트 사용자", // Mock user name
    });
    // Mock window.innerWidth for desktop by default
    Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper to trigger a resize event
  const triggerResize = (width: number) => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: width });
    fireEvent(window, new Event("resize"));
  };

  it("renders the logo and user name correctly", () => {
    render(<Header>Children Content</Header>);

    // Check for logo
    const logo = screen.getByAltText("로고");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("width", "71"); // Desktop size

    // Check for user name
    expect(screen.getByText(/이름 : 테스트 사용자/i)).toBeInTheDocument();
  });

  it("renders all navigation menu items", () => {
    render(<Header>Children Content</Header>);

    expect(screen.getByText("학적")).toBeInTheDocument();
    expect(screen.getByText("성적")).toBeInTheDocument();
    expect(screen.getByText("상담")).toBeInTheDocument();
    expect(screen.getByText("출결")).toBeInTheDocument();
    expect(screen.getByText("행동")).toBeInTheDocument();
  });

  it("highlights the active navigation item based on router.pathname", () => {
    render(<Header>Children Content</Header>);

    // "학적" should be active due to mockPathname
    const activeMenuItem = screen.getByText("학적");
    expect(activeMenuItem).toHaveClass("text-[#0064FF]");

    // Other items should not be active
    expect(screen.getByText("성적")).not.toHaveClass("text-[#0064FF]");
  });

  it("navigates to the correct path when a menu item is clicked", () => {
    render(<Header>Children Content</Header>);

    const gradeMenuItem = screen.getByText("성적");
    fireEvent.click(gradeMenuItem);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/grade");
  });

  it("navigates to the home page when the logo is clicked", () => {
    render(<Header>Children Content</Header>);

    const logo = screen.getByAltText("로고");
    fireEvent.click(logo);

    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/");
  });


  it("adjusts logo size and font size for mobile screens", () => {
    render(<Header>Children Content</Header>);

    // Simulate mobile screen width
    triggerResize(400);

    const logo = screen.getByAltText("로고");
    expect(logo).toHaveAttribute("width", "45"); // Mobile size

    // Check font size of a menu item
    const studentRecordMenuItem = screen.getByText("학적");
    expect(studentRecordMenuItem).toHaveClass("text-base"); // Mobile font size
  });

  it("renders children content within the header", () => {
    const childrenContent = "This is a test child";
    render(<Header>{childrenContent}</Header>);

    expect(screen.getByText(childrenContent)).toBeInTheDocument();
  });
});
