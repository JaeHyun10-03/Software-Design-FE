// __tests__/hooks/useGradeHandlers.test.ts
import { renderHook, act } from "@testing-library/react";
import { useGradeHandlers } from "@/hooks/useGradeHandlers";
import * as postScoreApi from "@/api/postScore";
import * as postEvalApi from "@/api/postEval";

// 모듈 mock
jest.mock("@/api/postScore");
jest.mock("@/api/postEval");
jest.mock("@/utils/gradeUtils", () => ({
  convertToApiFormat: jest.fn(() => "convertedPayload"),
}));

describe("useGradeHandlers", () => {
  const students = [{ number: 1, name: "홍길동" }];
  const evaluations = [{ evaluationId: 1, title: "중간고사", examType: "WRITTEN", weight: 20, fullScore: 100 }];
  const classNumber = "1";
  const evalInput = {
    title: "기말고사",
    examType: "WRITTEN",
    weight: 30,
    fullScore: 100,
  };

  let setEvaluations: jest.Mock;
  let setShowEvalInput: jest.Mock;
  let setEvalInput: jest.Mock;

  beforeEach(() => {
    setEvaluations = jest.fn();
    setShowEvalInput = jest.fn();
    setEvalInput = jest.fn();
    jest.clearAllMocks();
  });

  it("handleSave: PostScore가 호출되고 새로고침된다", async () => {
    (postScoreApi.PostScore as jest.Mock).mockResolvedValueOnce({});
    const reloadMock = jest.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    const { result } = renderHook(() =>
      useGradeHandlers(
        students,
        evaluations,
        classNumber,
        evalInput,
        setEvaluations,
        setShowEvalInput,
        setEvalInput
      )
    );

    // 이벤트 객체 mock
    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleSave(fakeEvent);
    });

    expect(postScoreApi.PostScore).toHaveBeenCalledWith("convertedPayload");
    expect(reloadMock).toHaveBeenCalled();
  });

  it("handleSave: 실패시 alert가 호출된다", async () => {
    (postScoreApi.PostScore as jest.Mock).mockRejectedValueOnce(new Error("저장실패"));
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useGradeHandlers(
        students,
        evaluations,
        classNumber,
        evalInput,
        setEvaluations,
        setShowEvalInput,
        setEvalInput
      )
    );
    const fakeEvent = { preventDefault: jest.fn() } as any;

    await act(async () => {
      await result.current.handleSave(fakeEvent);
    });

    expect(alertMock).toHaveBeenCalledWith("저장에 실패했습니다. 다시 시도해주세요.");
    alertMock.mockRestore();
  });

  it("handleAddEval: 입력값 없으면 alert만 호출", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useGradeHandlers(
        students,
        evaluations,
        classNumber,
        { ...evalInput, title: "" },
        setEvaluations,
        setShowEvalInput,
        setEvalInput
      )
    );
    await act(async () => {
      await result.current.handleAddEval("수학", "2025", "1", "1");
    });
    expect(alertMock).toHaveBeenCalledWith("평가명을 입력하세요.");
    alertMock.mockRestore();
  });

  it("handleAddEval: PostEval이 호출되고 setEvaluations 등도 호출된다", async () => {
    (postEvalApi.PostEval as jest.Mock).mockResolvedValueOnce({});
    const { result } = renderHook(() =>
      useGradeHandlers(
        students,
        evaluations,
        classNumber,
        evalInput,
        setEvaluations,
        setShowEvalInput,
        setEvalInput
      )
    );
    await act(async () => {
      await result.current.handleAddEval("수학", "2025", "1", "1");
    });
    expect(postEvalApi.PostEval).toHaveBeenCalledWith(
      "수학", 2025, 1, 1, "WRITTEN", "기말고사", 30, 100
    );
    expect(setEvaluations).toHaveBeenCalled();
    expect(setShowEvalInput).toHaveBeenCalledWith(false);
    expect(setEvalInput).toHaveBeenCalledWith({
      title: "",
      examType: "WRITTEN",
      weight: 20,
      fullScore: 100,
    });
  });

  it("handleAddEval: 실패시 alert가 호출된다", async () => {
    (postEvalApi.PostEval as jest.Mock).mockRejectedValueOnce(new Error("실패"));
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
    const { result } = renderHook(() =>
      useGradeHandlers(
        students,
        evaluations,
        classNumber,
        evalInput,
        setEvaluations,
        setShowEvalInput,
        setEvalInput
      )
    );
    await act(async () => {
      await result.current.handleAddEval("수학", "2025", "1", "1");
    });
    expect(alertMock).toHaveBeenCalledWith("평가방식 추가에 실패했습니다.");
    alertMock.mockRestore();
  });
});
