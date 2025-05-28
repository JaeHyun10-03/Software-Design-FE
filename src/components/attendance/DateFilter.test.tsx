import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateFilter from "./DateFilter";

describe("DateFilter", () => {
  test("연도와 월 셀렉트 박스가 렌더링된다", () => {
    render(<DateFilter />);

    expect(screen.getByDisplayValue("2025")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4")).toBeInTheDocument(); // "04" → "4"
    expect(screen.getByText("년")).toBeInTheDocument();
    expect(screen.getByText("월")).toBeInTheDocument();
  });

  test("연도 선택을 변경할 수 있다", () => {
    render(<DateFilter />);
    const yearSelect = screen.getByDisplayValue("2025");

    fireEvent.change(yearSelect, { target: { value: "2024" } });

    expect(screen.getByDisplayValue("2024")).toBeInTheDocument(); // 변경 후 값 확인
  });

  test("월 선택을 변경할 수 있다", () => {
    render(<DateFilter />);
    const monthSelect = screen.getByDisplayValue("4");

    fireEvent.change(monthSelect, { target: { value: "8" } });

    expect(screen.getByDisplayValue("8")).toBeInTheDocument(); // 변경 후 값 확인
  });

  test("연도 옵션은 3개이다", () => {
    render(<DateFilter />);
    const yearSelect = screen.getByText("년").previousSibling as HTMLSelectElement;

    expect(yearSelect.children.length).toBe(3);
    expect(yearSelect).toHaveTextContent("2023");
    expect(yearSelect).toHaveTextContent("2024");
    expect(yearSelect).toHaveTextContent("2025");
  });

  test("월 옵션은 12개이다", () => {
    render(<DateFilter />);
    const monthSelect = screen.getByText("월").previousSibling as HTMLSelectElement;

    expect(monthSelect.children.length).toBe(12);
    expect(monthSelect).toHaveTextContent("1"); // "01" → "1"
    expect(monthSelect).toHaveTextContent("12");
  });
});
