import { render, screen, waitFor } from "@testing-library/react";
import Behavior from "@/components/student-record/category/Behavior";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";
import useBehaviorStore from "@/store/behavior-store";
import useSelectedDate from "@/store/selected-date-store";

jest.mock("axios");

jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/store/behavior-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@/store/selected-date-store", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Behavior Component", () => {
  const mockSetBehavior = jest.fn();
  const mockSetBehaviorId = jest.fn();
  const mockSetGeneralComment = jest.fn();

  beforeEach(() => {
    (useStudentFilterStore as unknown as jest.Mock).mockReturnValue({
      grade: 1,
      classNumber: 2,
      studentId: 3,
      isReady: true,
    });

    (useSelectedDate as unknown as jest.Mock).mockReturnValue({
      year: 2024,
    });

    (useBehaviorStore as unknown as jest.Mock).mockReturnValue({
      behavior: "",
      generalComment: "",
      setBehavior: mockSetBehavior,
      setBehaviorId: mockSetBehaviorId,
      setGeneralComment: mockSetGeneralComment,
    });

    localStorage.setItem("accessToken", "mocked-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("API에서 받아온 행동특성, 종합의견을 스토어에 설정한다", async () => {
    const apiResponse = {
      data: {
        response: {
          behavior: "좋은 행동",
          behaviorId: "behavior123",
          generalComment: "전반적으로 우수함",
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValue(apiResponse);

    render(<Behavior />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/behavior"),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer mocked-token",
          }),
        })
      );
    });

    expect(mockSetBehavior).toHaveBeenCalledWith("좋은 행동");
    expect(mockSetBehaviorId).toHaveBeenCalledWith("behavior123");
    expect(mockSetGeneralComment).toHaveBeenCalledWith("전반적으로 우수함");
  });

  it("API 호출 실패 시 에러를 콘솔에 출력한다", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (axios.get as jest.Mock).mockRejectedValue(new Error("API 실패"));

    render(<Behavior />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("행동 정보 가져오기 오류:", expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it("스토어에서 받아온 behavior와 generalComment를 화면에 보여준다", () => {
    (useBehaviorStore as unknown as jest.Mock).mockReturnValue({
      behavior: "테스트 행동특성",
      generalComment: "테스트 종합의견",
      setBehavior: mockSetBehavior,
      setBehaviorId: mockSetBehaviorId,
      setGeneralComment: mockSetGeneralComment,
    });

    render(<Behavior />);

    expect(screen.getByText("테스트 행동특성")).toBeInTheDocument();
    expect(screen.getByText("테스트 종합의견")).toBeInTheDocument();
  });
});
