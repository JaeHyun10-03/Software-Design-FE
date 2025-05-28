// __tests__/pages/ReturnId.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReturnId from "@/pages/findId/[id]/index";

// next/navigation mock — ES 모듈 형태로
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push: pushMock }),
  useParams: jest.fn(),
}));

import { useParams } from "next/navigation";

describe("<ReturnId />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("id가 있으면 해당 id가 노출된다", () => {
    // useParams mock 설정
    (useParams as jest.Mock).mockReturnValue({ id: "testuser" });

    render(<ReturnId />);
    expect(
      screen.getByText("회원님의 아이디는 testuser 입니다.")
    ).toBeInTheDocument();
  });

  it("확인 완료 버튼 클릭 시 /student-record로 이동한다", () => {
    (useParams as jest.Mock).mockReturnValue({ id: "tester" });

    render(<ReturnId />);
    const button = screen.getByRole("button", { name: "확인 완료" });
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/student-record");
  });
});
