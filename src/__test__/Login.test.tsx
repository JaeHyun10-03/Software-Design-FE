import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/index";
import { useRouter } from "next/navigation";
import * as postLoginApi from "@/api/postLogin";

// PostLogin 모듈을 mock 처리
jest.mock("@/api/postLogin", () => ({
  PostLogin: jest.fn(),
}));

// 라우터, alert mocking
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
const pushMock = jest.fn();
(window as any).alert = jest.fn();

describe("<Login />", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("렌더링: 아이디/비밀번호 입력창과 로그인 버튼이 있다", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("아이디 입력")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호 입력")).toBeInTheDocument();
    expect(screen.getByText("로그인하기")).toBeInTheDocument();
  });

  it("입력: 아이디와 비밀번호 입력이 잘 된다", () => {
    render(<Login />);
    const idInput = screen.getByPlaceholderText("아이디 입력") as HTMLInputElement;
    const pwInput = screen.getByPlaceholderText("비밀번호 입력") as HTMLInputElement;

    fireEvent.change(idInput, { target: { value: "testid" } });
    fireEvent.change(pwInput, { target: { value: "testpw" } });

    expect(idInput.value).toBe("testid");
    expect(pwInput.value).toBe("testpw");
  });

  it("예외: 아이디/비밀번호 미입력 시 alert 호출", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("로그인하기"));
    expect(window.alert).toHaveBeenCalledWith("아이디와 비밀번호를 모두 입력해주세요.");
  });

  it("로그인 성공 시 PostLogin 호출, localStorage 저장, 라우팅", async () => {
    (postLoginApi.PostLogin as jest.Mock).mockResolvedValue({
      accessToken: "mockToken",
      role: "TEACHER",
      name: "홍길동", // 필요하다면 name도 같이 줘야 함
    });

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("아이디 입력"), { target: { value: "2025010201" } });
    fireEvent.change(screen.getByPlaceholderText("비밀번호 입력"), { target: { value: "12345" } });
    fireEvent.click(screen.getByText("로그인하기"));

    await waitFor(() => {
      expect(postLoginApi.PostLogin).toHaveBeenCalledWith("2025010201", "12345");
      expect(localStorage.getItem("accessToken")).toBe("mockToken");
      expect(pushMock).toHaveBeenCalledWith("/student-record");
    });
  });

  it("로그인 실패 시 alert 호출", async () => {
    (postLoginApi.PostLogin as jest.Mock).mockRejectedValue("로그인 실패");

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText("아이디 입력"), { target: { value: "testid" } });
    fireEvent.change(screen.getByPlaceholderText("비밀번호 입력"), { target: { value: "testpw" } });
    fireEvent.click(screen.getByText("로그인하기"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("로그인 실패");
    });
  });

  it("'아이디 찾기' 클릭 시 라우팅", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("아이디 찾기"));
    expect(pushMock).toHaveBeenCalledWith("/findId");
  });

  it("'비밀번호 찾기' 클릭 시 라우팅", () => {
    render(<Login />);
    fireEvent.click(screen.getByText("비밀번호 찾기"));
    expect(pushMock).toHaveBeenCalledWith("/findPW");
  });
});
