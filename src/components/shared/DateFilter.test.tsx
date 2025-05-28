import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateFilter from "./DateFilter";
import useSelectedDate from "@/store/selected-date-store";

// zustand store mocking
jest.mock("@/store/selected-date-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("DateFilter", () => {
  const mockSetYear = jest.fn();
  const mockSetMonth = jest.fn();
  const mockSetSemester = jest.fn();

  beforeEach(() => {
    (useSelectedDate as jest.Mock).mockReturnValue({
      year: 2024,
      month: 5,
      semester: 1,
      setYear: mockSetYear,
      setMonth: mockSetMonth,
      setSemester: mockSetSemester,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders year, month, and semester selects with correct default values", () => {
    render(<DateFilter />);

    expect(screen.getByDisplayValue("2024")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
  });

  it("calls setYear when year is changed", () => {
    render(<DateFilter />);
    fireEvent.change(screen.getByDisplayValue("2024"), { target: { value: "2025" } });
    expect(mockSetYear).toHaveBeenCalledWith(2025);
  });

  it("calls setMonth when month is changed", () => {
    render(<DateFilter />);
    fireEvent.change(screen.getByDisplayValue("5"), { target: { value: "6" } });
    expect(mockSetMonth).toHaveBeenCalledWith(6);
  });

  it("calls setSemester when semester is changed", () => {
    render(<DateFilter />);
    fireEvent.change(screen.getByDisplayValue("1"), { target: { value: "2" } });
    expect(mockSetSemester).toHaveBeenCalledWith(2);
  });
});
