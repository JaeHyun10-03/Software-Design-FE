// __tests__/pages/FindPW.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FindPW from "@/pages/findPW";
import { useRouter } from "next/navigation";
import * as postFindPWApi from "@/api/postFindPW";

// 라우터 mock
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// API mock
jest.mock("@/api/postFindPW", () => ({
  PostFindPW: jest.fn(),
}));

describe("<FindPW />", () => {
  const pushMock = jest.fn();
  const alertMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    window.alert = alertMock;
  });

  it("모든 입력창과 버튼이 렌더링된다", () => {
    render(<FindPW />);
    expect(screen.getByPlaceholderText("이름을 작성해주세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("휴대폰 번호를 작성해주세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("주민등록번호를 작성해주세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("중학교 or 고등학교를 선택해주세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "작성 완료" })).toBeInTheDocument();
  });

  it("입력값이 잘 변경된다", () => {
    render(<FindPW />);
    const nameInput = screen.getByPlaceholderText("이름을 작성해주세요") as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText("휴대폰 번호를 작성해주세요") as HTMLInputElement;
    const idInput = screen.getByPlaceholderText("주민등록번호를 작성해주세요") as HTMLInputElement;
    const schoolInput = screen.getByPlaceholderText("중학교 or 고등학교를 선택해주세요") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "홍길동" } });
    fireEvent.change(phoneInput, { target: { value: "010-1234-5678" } });
    fireEvent.change(idInput, { target: { value: "010101-1234567" } });
    fireEvent.change(schoolInput, { target: { value: "고등학교" } });

    expect(nameInput.value).toBe("홍길동");
    expect(phoneInput.value).toBe("010-1234-5678");
    expect(idInput.value).toBe("010101-1234567");
    expect(schoolInput.value).toBe("고등학교");
  });

  it("입력값이 비어있으면 alert가 호출된다", () => {
    render(<FindPW />);
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));
    expect(alertMock).toHaveBeenCalledWith("정보를 모두 입력해주세요.");
  });

  it("비밀번호 찾기 성공 시 라우팅이 호출된다", async () => {
    (postFindPWApi.PostFindPW as jest.Mock).mockResolvedValueOnce({ password: "pw1234" });
    render(<FindPW />);
    fireEvent.change(screen.getByPlaceholderText("이름을 작성해주세요"), { target: { value: "홍길동" } });
    fireEvent.change(screen.getByPlaceholderText("휴대폰 번호를 작성해주세요"), { target: { value: "010-1234-5678" } });
    fireEvent.change(screen.getByPlaceholderText("주민등록번호를 작성해주세요"), { target: { value: "010101-1234567" } });
    fireEvent.change(screen.getByPlaceholderText("중학교 or 고등학교를 선택해주세요"), { target: { value: "고등학교" } });
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));

    await waitFor(() => {
      expect(postFindPWApi.PostFindPW).toHaveBeenCalledWith("홍길동", "010-1234-5678", "010101-1234567", "고등학교");
      expect(pushMock).toHaveBeenCalledWith("/findPW/pw1234");
    });
  });

  it("비밀번호 찾기 실패 시 alert가 호출된다", async () => {
    (postFindPWApi.PostFindPW as jest.Mock).mockRejectedValueOnce("찾기실패");
    render(<FindPW />);
    fireEvent.change(screen.getByPlaceholderText("이름을 작성해주세요"), { target: { value: "홍길동" } });
    fireEvent.change(screen.getByPlaceholderText("휴대폰 번호를 작성해주세요"), { target: { value: "010-1234-5678" } });
    fireEvent.change(screen.getByPlaceholderText("주민등록번호를 작성해주세요"), { target: { value: "010101-1234567" } });
    fireEvent.change(screen.getByPlaceholderText("중학교 or 고등학교를 선택해주세요"), { target: { value: "고등학교" } });
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("찾기실패");
    });
  });
});
