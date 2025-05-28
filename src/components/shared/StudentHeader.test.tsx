// src/components/shared/StudentHeader.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/router";
import { StudentHeader } from "./StudentHeader";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/store/login-store", () => ({
  __esModule: true,
  default: () => ({ name: "테스트유저" }),
}));

describe("StudentHeader", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock, pathname: "/student/attendance" });
    pushMock.mockClear();
  });

  it("renders user name", () => {
    render(<StudentHeader>children</StudentHeader>);
    expect(screen.getByText(/이름 : 테스트유저/)).toBeInTheDocument();
  });

  it("calls router.push('/alert') when alert icon clicked", () => {
    render(<StudentHeader>children</StudentHeader>);

    // 예시 1: testid 사용
    const alertDiv = screen.getByTestId("alert-icon");

    fireEvent.click(alertDiv);
    expect(pushMock).toHaveBeenCalledWith("/alert");
  });
});
