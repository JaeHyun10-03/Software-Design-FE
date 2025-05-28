import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cell from "./Cell";

describe("Cell 컴포넌트", () => {
  it("기본 type은 M이고, 해당 높이 클래스를 적용한다", () => {
    render(<Cell>내용</Cell>);

    const cell = screen.getByText("내용");
    expect(cell).toHaveClass("h-16");
  });

  it("type에 따라 적절한 높이 클래스를 적용한다", () => {
    const { rerender } = render(<Cell type="S">작은</Cell>);
    expect(screen.getByText("작은")).toHaveClass("h-8");

    rerender(<Cell type="L">큰</Cell>);
    expect(screen.getByText("큰")).toHaveClass("h-24");

    rerender(<Cell type="XL">아주큰</Cell>);
    expect(screen.getByText("아주큰")).toHaveClass("h-64");
  });

  it("onClick이 있으면 cursor-pointer 클래스가 추가되고 클릭 이벤트가 발생한다", () => {
    const handleClick = jest.fn();
    render(<Cell onClick={handleClick}>클릭</Cell>);

    const cell = screen.getByText("클릭");
    expect(cell).toHaveClass("cursor-pointer");

    fireEvent.click(cell);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("onClick이 없으면 cursor-pointer 클래스가 없다", () => {
    render(<Cell>클릭없음</Cell>);

    const cell = screen.getByText("클릭없음");
    expect(cell).not.toHaveClass("cursor-pointer");
  });
});
