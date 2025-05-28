// __tests__/components/StudentBehaviorContent.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import BehaviorContent from "@/components/behavior/StudentBehaviorContent";
import * as getBehaviorApi from "@/api/student/getBehavior";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";

// store mock
jest.mock("@/store/student-filter-store");
jest.mock("@/store/selected-date-store");
// API mock
jest.mock("@/api/student/getBehavior");

describe("<BehaviorContent />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // store mock 리턴값
    (useStudentFilterStore as unknown as jest.Mock).mockReturnValue({
      grade: "1",
      classNumber: "2",
      studentId: "3",
    });
    (useSelectedDate as unknown as jest.Mock).mockReturnValue({
      year: "2025",
    });
  });

  it("행동특성/종합의견이 API 데이터로 렌더링된다", async () => {
    (getBehaviorApi.GetBehavior as jest.Mock).mockResolvedValueOnce({
      behavior: "성실하게 생활함",
      generalComment: "종합적으로 우수함",
    });

    render(<BehaviorContent />);
    expect(screen.getByText("행동특성")).toBeInTheDocument();
    expect(screen.getByText("종합의견")).toBeInTheDocument();

    // 비동기 데이터가 textarea에 반영되는지 확인
    await waitFor(() => {
      expect(screen.getByDisplayValue("성실하게 생활함")).toBeInTheDocument();
      expect(screen.getByDisplayValue("종합적으로 우수함")).toBeInTheDocument();
    });
  });

  it("API 에러 시 콘솔에 에러가 찍혀도 렌더링은 된다", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getBehaviorApi.GetBehavior as jest.Mock).mockRejectedValueOnce(new Error("API 실패"));

    render(<BehaviorContent />);
    expect(screen.getByText("행동특성")).toBeInTheDocument();
    expect(screen.getByText("종합의견")).toBeInTheDocument();

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalled();
    });

    errorSpy.mockRestore();
  });
});
