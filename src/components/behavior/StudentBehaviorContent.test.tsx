import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BehaviorContent from "./StudentBehaviorContent";
import { GetBehavior } from "@/api/student/getBehavior";

// Mock the correct student store and provide the correct properties
jest.mock("@/store/student-store", () => () => ({
  grade: "1",
  classNumber: "2",
  studentNumber: "3", // Corrected: use studentNumber
}));

jest.mock("@/store/selected-date-store", () => () => ({
  year: 2025,
}));

// Mock API
jest.mock("@/api/student/getBehavior");

describe("BehaviorContent", () => {
  beforeEach(() => {
    GetBehavior.mockResolvedValue({
      behavior: "성실히 수업에 참여함",
      generalComment: "매사에 긍정적인 태도를 보임",
    });
  });

  it("제목들이 잘 렌더링되는가?", () => {
    render(<BehaviorContent />);
    expect(screen.getByText("행동특성")).toBeInTheDocument();
    expect(screen.getByText("종합의견")).toBeInTheDocument();
  });

  it("API로부터 데이터를 불러와 textarea에 잘 표시하는가?", async () => {
    render(<BehaviorContent />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("성실히 수업에 참여함")).toBeInTheDocument();
      expect(screen.getByDisplayValue("매사에 긍정적인 태도를 보임")).toBeInTheDocument();
    });
  });

  it("GetBehavior 함수가 호출되는가?", async () => {
    render(<BehaviorContent />);

    await waitFor(() => {
      expect(GetBehavior).toHaveBeenCalledWith(2025, 1, 2, 3);
    });
  });
});
