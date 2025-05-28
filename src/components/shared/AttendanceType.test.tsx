import React from "react";
import { render, screen } from "@testing-library/react";
import AttendanceType from "./AttendanceType";

describe("AttendanceType", () => {
  it("renders the attendance legend text correctly", () => {
    render(<AttendanceType />);
    const legendText = screen.getByText(/O : 출석 \| △ : 조퇴 \| ▲ : 지각 \| X : 결석/);
    expect(legendText).toBeInTheDocument();
  });
});
