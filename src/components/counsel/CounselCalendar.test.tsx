// src/components/CounselCalendar.test.tsx
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { CounselCalendar } from "./CounselCalendar";

describe("CounselCalendar", () => {
  const mockDateClick = jest.fn();
  const mockEventClick = jest.fn();

  const mockEvents = [
    {
      id: "1",
      title: "상담 일정",
      date: "2024-06-01",
      backgroundColor: "#007bff",
      borderColor: "#007bff",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("렌더링 된다", () => {
    const { getByText, getByTestId } = render(<CounselCalendar events={mockEvents} selectedDate="2024-06-01" handleDateClick={mockDateClick} handleEventClick={mockEventClick} />);

    expect(getByTestId("full-calendar")).toBeInTheDocument();
    expect(getByText("상담 일정")).toBeInTheDocument();
  });

  it("날짜 클릭 시 handleDateClick 호출된다", () => {
    const { getByTestId } = render(<CounselCalendar events={mockEvents} selectedDate="2024-06-01" handleDateClick={mockDateClick} handleEventClick={mockEventClick} />);

    const calendarCell = getByTestId("calendar-cell");
    fireEvent.click(calendarCell);

    expect(mockDateClick).toHaveBeenCalled();
  });

  it("이벤트 클릭 시 handleEventClick 호출된다", () => {
    const { getByTestId } = render(<CounselCalendar events={mockEvents} selectedDate="2024-06-01" handleDateClick={mockDateClick} handleEventClick={mockEventClick} />);

    const eventElement = getByTestId("event-1");
    fireEvent.click(eventElement);

    expect(mockEventClick).toHaveBeenCalled();
  });

  it("선택된 날짜에 selected-date 클래스가 적용된다", () => {
    const { getByTestId } = render(<CounselCalendar events={mockEvents} selectedDate="2024-06-01" handleDateClick={mockDateClick} handleEventClick={mockEventClick} />);

    const calendarCell = getByTestId("calendar-cell");
    expect(calendarCell).toHaveClass("selected-date");
  });

  it("이벤트가 올바른 스타일로 렌더링된다", () => {
    const { getByTestId } = render(<CounselCalendar events={mockEvents} selectedDate="2024-06-01" handleDateClick={mockDateClick} handleEventClick={mockEventClick} />);

    const eventElement = getByTestId("event-1");
    expect(eventElement).toHaveStyle({
      backgroundColor: "#007bff",
      borderColor: "#007bff",
    });
  });
});
