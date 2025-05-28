// __tests__/pages/ReturnPw.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ReturnPw from "@/pages/findPW/[pw]/index";

// next/navigation mock — 반드시 import 전에 선언
const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  useRouter: () => ({ push: pushMock }),
  useParams: jest.fn(),
}));

import { useParams } from "next/navigation";

describe("<ReturnPw />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("pw가 있으면 해당 pw가 노출된다", () => {
    // mock useParams 값 설정
    (useParams as jest.Mock).mockReturnValue({ pw: "testpw" });

    render(<ReturnPw />);
    expect(
      screen.getByText("회원님의 비밀번호는 testpw 입니다.")
    ).toBeInTheDocument();
  });

  it("확인 완료 버튼 클릭 시 /student-record로 이동한다", () => {
    (useParams as jest.Mock).mockReturnValue({ pw: "testerpw" });

    render(<ReturnPw />);
    const button = screen.getByRole("button", { name: "확인 완료" });
    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/student-record");
  });
});
