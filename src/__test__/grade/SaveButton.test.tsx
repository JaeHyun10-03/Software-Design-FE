// __tests__/components/SaveButton.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SaveButton } from "@/components/grade/SaveButton";

describe("<SaveButton />", () => {
  it("버튼이 '저장' 텍스트와 함께 렌더링된다", () => {
    render(<SaveButton onClick={jest.fn()} />);
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  it("버튼 클릭 시 onClick 핸들러가 호출된다", () => {
    const handleClick = jest.fn();
    render(<SaveButton onClick={handleClick} />);
    const button = screen.getByRole("button", { name: "저장" });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("버튼에 올바른 클래스가 적용된다", () => {
    render(<SaveButton onClick={jest.fn()} />);
    const button = screen.getByRole("button", { name: "저장" });
    expect(button).toHaveClass("w-[84px]", "h-[32px]", "bg-[#0064FF]", "rounded-[6px]", "text-white", "mb-[14px]");
  });
});
