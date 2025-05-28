import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Category } from "./Category";

// useCategoryStore mock
const mockSetCategory = jest.fn();

jest.mock("@/store/category-store", () => ({
  __esModule: true,
  default: () => ({
    category: "출결",
    setCategory: mockSetCategory,
  }),
}));

describe("Category 컴포넌트", () => {
  beforeEach(() => {
    mockSetCategory.mockClear();
  });

  it("카테고리 리스트를 렌더링하고 현재 선택된 카테고리를 강조 표시한다", () => {
    render(<Category />);

    const categoryItems = screen.getAllByText(/학적|성적|출결|행동|상담/);
    expect(categoryItems.length).toBe(5);

    // 현재 선택된 '출결' 항목에 배경색 스타일이 적용됐는지 확인
    const selectedItem = screen.getByText("출결").parentElement;
    expect(selectedItem).toHaveClass("bg-[#4DAAF880]");
  });

  it("카테고리 클릭 시 setCategory 함수가 호출된다", () => {
    render(<Category />);

    const target = screen.getByText("성적");
    fireEvent.click(target);

    expect(mockSetCategory).toHaveBeenCalledTimes(1);
    expect(mockSetCategory).toHaveBeenCalledWith("성적");
  });
});
