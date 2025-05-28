import { render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
  it("textarea를 렌더링한다", () => {
    render(<Input />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
  });

  it("placeholder가 전달되면 렌더링된다", () => {
    render(<Input placeholder="내용을 입력하세요" />);
    expect(screen.getByPlaceholderText("내용을 입력하세요")).toBeInTheDocument();
  });

  it("className이 전달되면 포함된다", () => {
    const { container } = render(<Input className="bg-red-500" />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("bg-red-500");
  });
});
