// __tests__/pages/ChangePw.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChangePw from "@/pages/changePW";
import { useRouter } from "next/navigation";
import * as putPasswordApi from "@/api/putPassword";

// 라우터 mock
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// API mock
jest.mock("@/api/putPassword", () => ({
  PutPassword: jest.fn(),
}));

describe("<ChangePw />", () => {
  const pushMock = jest.fn();
  const alertMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    window.alert = alertMock;
  });

  it("모든 입력창과 버튼이 렌더링된다", () => {
    render(<ChangePw />);
    expect(screen.getByPlaceholderText("아이디를 입력해주세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("기존 비밀번호를 입력해주세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("새로운 비밀번호를 입력해주세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "작성 완료" })).toBeInTheDocument();
  });

  it("입력값이 잘 변경된다", () => {
    render(<ChangePw />);
    const idInput = screen.getByPlaceholderText("아이디를 입력해주세요") as HTMLInputElement;
    const oldPwInput = screen.getByPlaceholderText("기존 비밀번호를 입력해주세요") as HTMLInputElement;
    const newPwInput = screen.getByPlaceholderText("새로운 비밀번호를 입력해주세요") as HTMLInputElement;

    fireEvent.change(idInput, { target: { value: "testid" } });
    fireEvent.change(oldPwInput, { target: { value: "oldpw" } });
    fireEvent.change(newPwInput, { target: { value: "Newpw123!" } });

    expect(idInput.value).toBe("testid");
    expect(oldPwInput.value).toBe("oldpw");
    expect(newPwInput.value).toBe("Newpw123!");
  });

  it("입력값이 비어있으면 alert가 호출된다", () => {
    render(<ChangePw />);
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));
    expect(alertMock).toHaveBeenCalledWith("정보를 모두 입력해주세요.");
  });

  it("비밀번호 규칙이 맞지 않으면 alert가 호출된다", () => {
    render(<ChangePw />);
    fireEvent.change(screen.getByPlaceholderText("아이디를 입력해주세요"), { target: { value: "testid" } });
    fireEvent.change(screen.getByPlaceholderText("기존 비밀번호를 입력해주세요"), { target: { value: "oldpw" } });
    fireEvent.change(screen.getByPlaceholderText("새로운 비밀번호를 입력해주세요"), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));
    expect(alertMock).toHaveBeenCalledWith(
      "비밀번호는 8자 이상, 영문 대/소문자 포함, 숫자 또는 특수문자 중 최소 1개를 포함해야 합니다."
    );
  });

  it("비밀번호 변경 성공 시 alert, 라우팅이 호출된다", async () => {
    (putPasswordApi.PutPassword as jest.Mock).mockResolvedValueOnce("ok");
    render(<ChangePw />);
    fireEvent.change(screen.getByPlaceholderText("아이디를 입력해주세요"), { target: { value: "testid" } });
    fireEvent.change(screen.getByPlaceholderText("기존 비밀번호를 입력해주세요"), { target: { value: "oldpw123" } });
    fireEvent.change(screen.getByPlaceholderText("새로운 비밀번호를 입력해주세요"), { target: { value: "Newpw123!" } });
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));

    await waitFor(() => {
      expect(putPasswordApi.PutPassword).toHaveBeenCalledWith("testid", "oldpw123", "Newpw123!");
      expect(alertMock).toHaveBeenCalledWith("비밀번호를 변경하였습니다");
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });

  it("비밀번호 변경 실패 시 alert가 호출된다", async () => {
    (putPasswordApi.PutPassword as jest.Mock).mockRejectedValueOnce("변경실패");
    render(<ChangePw />);
    fireEvent.change(screen.getByPlaceholderText("아이디를 입력해주세요"), { target: { value: "testid" } });
    fireEvent.change(screen.getByPlaceholderText("기존 비밀번호를 입력해주세요"), { target: { value: "oldpw123" } });
    fireEvent.change(screen.getByPlaceholderText("새로운 비밀번호를 입력해주세요"), { target: { value: "Newpw123!" } });
    fireEvent.click(screen.getByRole("button", { name: "작성 완료" }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("변경실패");
    });
  });
});
