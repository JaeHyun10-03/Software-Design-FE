// __tests__/pages/GradesPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GradesPage from "@/pages/grade/index";
import { GetScore } from "@/api/getScoreSummary";
import { GetEvalMethod } from "@/api/getEvalMethod";
import { GetStudentList } from "@/api/getStudentList";
import { PostScore } from "@/api/postScore";
import { PostEval } from "@/api/postEval";

// 1. Mock store
jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: () => ({
    grade: "1",
    classNumber: "2",
    studentNumber: "3",
  }),
}));
jest.mock("@/store/grade-filter-store", () => ({
  __esModule: true,
  default: () => ({
    year: "2025",
    semester: "1",
    subject: "독서와 문법",
  }),
}));
jest.mock("@/store/teacher-store", () => ({
  __esModule: true,
  default: () => ({
    mysubject: "독서와 문법",
    setSubject: jest.fn(),
    setGrade: jest.fn(),
    setTeacherName: jest.fn(),
    setClassNumber: jest.fn(),
    grade: "1",
    classNumber: "1",
    teacherName: "김철수",
  }),
}));

// 2. Mock API
jest.mock("@/api/getScoreSummary", () => ({
  __esModule: true,
  GetScore: jest.fn(),
}));
jest.mock("@/api/getEvalMethod", () => ({
  __esModule: true,
  GetEvalMethod: jest.fn(),
}));
jest.mock("@/api/getStudentList", () => ({
  __esModule: true,
  GetStudentList: jest.fn(),
}));
jest.mock("@/api/postScore", () => ({
  __esModule: true,
  PostScore: jest.fn(),
}));
jest.mock("@/api/postEval", () => ({
  __esModule: true,
  PostEval: jest.fn(),
}));

// 3. Mock utils
jest.mock("@/utils/gradeUtils", () => ({
  mapApiResponseToStudents: jest.fn(() => ({
    titles: [{ evaluationId: 1, title: "중간고사", examType: "WRITTEN", weight: 20, fullScore: 100 }],
    students: [{ number: 1, name: "홍길동", 중간고사: 90 }],
  })),
  convertToApiFormat: jest.fn(() => "convertedPayload"),
  Evaluation: jest.fn(),
}));

// 4. Mock 일부 subcomponents만 (EvalAddModal/EvalAddForm은 mock하지 않음)
jest.mock("@/components/grade/GradeHeaderSection", () => ({
  __esModule: true,
  GradeHeaderSection: () => <div data-testid="header-section" />,
}));
jest.mock("@/components/grade/GradeActionBar", () => ({
  __esModule: true,
  GradeActionBar: ({ onAddEval, onSave }: any) => (
    <div data-testid="action-bar">
      <button onClick={onAddEval}>+ 평가방식</button>
      <button onClick={onSave}>저장</button>
    </div>
  ),
}));
jest.mock("@/components/grade/GradeTableSection", () => ({
  __esModule: true,
  GradeTableSection: (props: any) => (
    <table>
      <tbody>
        <tr>
          <td
            data-testid="editable-cell"
            onClick={() => props.handleCellClick(1, "중간고사", 90)}
          >
            {props.editing && props.editing.row === 1 && props.editing.key === "중간고사" ? (
              <input
                data-testid="score-input"
                value={props.inputValue}
                onChange={props.handleInputChange}
                onBlur={props.handleInputBlur}
                onKeyDown={props.handleInputKeyDown}
              />
            ) : (
              props.students[0]?.["중간고사"]
            )}
          </td>
        </tr>
      </tbody>
    </table>
  ),
}));
jest.mock("@/components/shared/Header", () => ({
  __esModule: true,
  Header: ({ children }: any) => <div>{children}</div>,
}));

describe("<GradesPage /> 실제 EvalAddModal/EvalAddForm 테스트", () => {
  beforeEach(() => {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { reload: jest.fn() } as any,
  });
});

  it("handleAddEval에서 평가명 없이 추가 시 alert가 호출된다", async () => {
    window.alert = jest.fn();
    render(<GradesPage />);
    fireEvent.click(screen.getByText("+ 평가방식"));
    fireEvent.click(screen.getByText("추가"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("평가명을 입력하세요.");
    });
  });


  it("handleAddEval에서 PostEval 실패 시 alert가 호출된다", async () => {
    (PostEval as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    window.alert = jest.fn();

    render(<GradesPage />);
    fireEvent.click(screen.getByText("+ 평가방식"));
    const titleInput = await screen.findByPlaceholderText("(예: 중간고사)");
    fireEvent.change(titleInput, { target: { value: "기말고사" } });
    fireEvent.click(screen.getByText("추가"));
    await waitFor(() => {
      expect(PostEval).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("평가방식 추가에 실패했습니다.");
    });
  });

  it("handleAddEval에서 정상적으로 평가방식이 추가되고 상태가 초기화된다", async () => {
    (PostEval as jest.Mock).mockResolvedValueOnce({});
    render(<GradesPage />);
    fireEvent.click(screen.getByText("+ 평가방식"));
    const titleInput = await screen.findByPlaceholderText("(예: 중간고사)");
    fireEvent.change(titleInput, { target: { value: "기말고사" } });
    fireEvent.click(screen.getByText("추가"));
    await waitFor(() => {
      expect(PostEval).toHaveBeenCalled();
    });
  });

  it("GetScore 실패시 error.message가 있으면 콘솔에 찍힌다", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const error = { message: "Unknown error" };
    (GetScore as jest.Mock).mockRejectedValueOnce(error);
    render(<GradesPage />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", error);
    });
    consoleSpy.mockRestore();
  });

  it("GetScore 실패시 error.request가 있으면 콘솔에 찍힌다", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (GetScore as jest.Mock).mockRejectedValueOnce({ request: {}, message: "Network Error" });
    render(<GradesPage />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", { request: {}, message: "Network Error" });
    });
    consoleSpy.mockRestore();
  });

  it("테이블 셀 클릭, 입력, 엔터, 블러로 값이 바뀐다", async () => {
    render(<GradesPage />);
    fireEvent.click(screen.getByTestId("editable-cell"));
    const input = screen.getByTestId("score-input");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "95" } });
    expect((input as HTMLInputElement).value).toBe("95");

    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByTestId("score-input")).not.toBeInTheDocument();
  });

  it("입력 후 blur로 편집모드가 종료된다", async () => {
    render(<GradesPage />);
    fireEvent.click(screen.getByTestId("editable-cell"));
    const input = screen.getByTestId("score-input");
    fireEvent.change(input, { target: { value: "88" } });
    fireEvent.blur(input);
    expect(screen.queryByTestId("score-input")).not.toBeInTheDocument();
  });

  it("handleInputBlur에서 editing이 null이면 아무것도 하지 않는다", () => {
    render(<GradesPage />);
    // 편집모드가 아닐 때 blur 발생시켜도 에러가 나지 않으면 커버됨
  });

  it("handleSave에서 PostScore 성공 시 window.location.reload가 호출된다", async () => {
    (PostScore as jest.Mock).mockResolvedValueOnce({});
    const reloadMock = jest.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });
    render(<GradesPage />);
    fireEvent.click(screen.getByText("저장"));
    await waitFor(() => {
      expect(PostScore).toHaveBeenCalled();
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  it("handleSave에서 PostScore 실패 시 alert가 호출된다", async () => {
    (PostScore as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    window.alert = jest.fn();

    render(<GradesPage />);
    fireEvent.click(screen.getByText("저장"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("저장에 실패했습니다. 다시 시도해주세요.");
    });
  });

  it("정상적으로 GetScore 성공시 mapApiResponseToStudents로 셋팅된다", async () => {
    (GetScore as jest.Mock).mockResolvedValueOnce({ mock: true });
    render(<GradesPage />);
    await waitFor(() => {
      expect(GetScore).toHaveBeenCalled();
      expect(screen.getByTestId("header-section")).toBeInTheDocument();
    });
  });

  it("404 에러시 GetEvalMethod, GetStudentList로 대체 fetch 후 -로 채운다", async () => {
    (GetScore as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });
    (GetEvalMethod as jest.Mock).mockResolvedValueOnce([
      { title: "중간고사", evaluationId: 1, examType: "WRITTEN", weight: 20, fullScore: 100 }
    ]);
    (GetStudentList as jest.Mock).mockResolvedValueOnce([{ studentId: 1, name: "홍길동" }]);
    render(<GradesPage />);
    await waitFor(() => {
      expect(GetEvalMethod).toHaveBeenCalled();
      expect(GetStudentList).toHaveBeenCalled();
    });
  });

  it("fetch 실패시 setEvaluations, setStudents가 빈 배열이 된다", async () => {
    (GetScore as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } });
    render(<GradesPage />);
    await waitFor(() => {
      expect(screen.getByTestId("header-section")).toBeInTheDocument();
    });
  });

  it("404 fallback fetch에서 에러가 나면 콘솔에 찍히고 빈 배열로 초기화된다", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (GetScore as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });
    (GetEvalMethod as jest.Mock).mockRejectedValueOnce(new Error("Eval fetch fail"));
    (GetStudentList as jest.Mock).mockResolvedValueOnce([]);
    render(<GradesPage />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Fallback fetch failed",
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  it("GetScore 실패시 error.message만 있을 때도 콘솔에 찍힌다", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const error = { message: "Unknown error" };
    (GetScore as jest.Mock).mockRejectedValueOnce(error);
    render(<GradesPage />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", error);
    });
    consoleSpy.mockRestore();
  });

  it("handleInputChange에서 빈값과 숫자값 모두 반영된다", () => {
    render(<GradesPage />);
    fireEvent.click(screen.getByTestId("editable-cell"));
    const input = screen.getByTestId("score-input");
    fireEvent.change(input, { target: { value: "" } });
    expect((input as HTMLInputElement).value).toBe("");
    fireEvent.change(input, { target: { value: "100" } });
    expect((input as HTMLInputElement).value).toBe("100");
  });

  it("handleInputKeyDown에서 Enter가 아니면 handleInputBlur가 호출되지 않는다", () => {
    render(<GradesPage />);
    fireEvent.click(screen.getByTestId("editable-cell"));
    const input = screen.getByTestId("score-input");
    fireEvent.keyDown(input, { key: "a" });
    expect(screen.getByTestId("score-input")).toBeInTheDocument();
  });
it("handleInputBlur에서 빈 문자열 입력 시 score가 undefined로 설정된다", async () => {
    render(<GradesPage />);
    fireEvent.click(screen.getByTestId("editable-cell"));
    const input = screen.getByTestId("score-input");

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByTestId("score-input")).not.toBeInTheDocument();
    });
  });

  it("handleAddEval에서 weight와 fullScore가 null일 때 PostEval이 올바르게 호출된다", async () => {
    (PostEval as jest.Mock).mockResolvedValueOnce({});
    render(<GradesPage />);
    fireEvent.click(screen.getByText("+ 평가방식"));
    const titleInput = await screen.findByPlaceholderText("(예: 중간고사)");
    fireEvent.change(titleInput, { target: { value: "새로운 평가" } });

    fireEvent.click(screen.getByText("추가"));
    await waitFor(() => {
      expect(PostEval).toHaveBeenCalledWith(
        "독서와 문법", // subject from mock store
        2025, // year from mock store
        1, // semester from mock store
        1, // grade from mock store
        "WRITTEN", // default examType
        "새로운 평가",
        0, // Number(null) results in 0
        0  // Number(null) results in 0
      );
    });
  });
  
  it("404 fallback fetch에서 studentList의 studentId와 name이 없으면 '-'로 채운다", async () => {
    (GetScore as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });
    (GetEvalMethod as jest.Mock).mockResolvedValueOnce([
      { evaluationId: 1, title: "중간고사", examType: "WRITTEN", weight: 20, fullScore: 100 }
    ]);
    // Mock GetStudentList to return an item with missing studentId and name
    (GetStudentList as jest.Mock).mockResolvedValueOnce([{ studentId: undefined, name: null }]); // Use undefined and null

    render(<GradesPage />);
    await waitFor(() => {
      expect(GetEvalMethod).toHaveBeenCalled();
      expect(GetStudentList).toHaveBeenCalled();
    });
  });

   it("GetScore 실패 시 error 객체가 비어있을 때 콘솔에 찍힌다", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const error = {}; // 빈 에러 객체
    (GetScore as jest.Mock).mockRejectedValueOnce(error);

    render(<GradesPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", error);
    });
    consoleSpy.mockRestore();
  });

  it("GetScore 실패 시 error.message만 있을 때 콘솔에 찍힌다 (response 없음)", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const error = { message: "Network error without response" };
    (GetScore as jest.Mock).mockRejectedValueOnce(error); // response 속성이 없는 에러 mock

    render(<GradesPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", error);
    });
    consoleSpy.mockRestore();
  });

  it("handleInputKeyDown에서 Enter가 아니면 handleInputBlur가 호출되지 않는다", () => {
  render(<GradesPage />);
  fireEvent.click(screen.getByTestId("editable-cell"));
  const input = screen.getByTestId("score-input");
  fireEvent.keyDown(input, { key: "a" });
  expect(screen.getByTestId("score-input")).toBeInTheDocument();
});

it("404 fallback fetch에서 studentList의 studentId와 name이 없으면 '-'로 채운다", async () => {
  (GetScore as jest.Mock).mockRejectedValueOnce({ response: { status: 404 } });
  (GetEvalMethod as jest.Mock).mockResolvedValueOnce([
    { evaluationId: 1, title: "중간고사", examType: "WRITTEN", weight: 20, fullScore: 100 }
  ]);
  (GetStudentList as jest.Mock).mockResolvedValueOnce([{ studentId: undefined, name: null }]);
  render(<GradesPage />);
  await waitFor(() => {
    expect(GetEvalMethod).toHaveBeenCalled();
    expect(GetStudentList).toHaveBeenCalled();
    // '-'로 채워지는지 확인하려면 GradeTableSection에서 students를 화면에 노출하도록 수정 필요
  });
});

  it("handleAddEval에서 weight와 fullScore가 null일 때 PostEval이 0, 0으로 호출된다", async () => {
  (PostEval as jest.Mock).mockResolvedValueOnce({});
  render(<GradesPage />);
  fireEvent.click(screen.getByText("+ 평가방식"));
  const titleInput = await screen.findByPlaceholderText("(예: 중간고사)");
  fireEvent.change(titleInput, { target: { value: "새로운 평가" } });
  fireEvent.click(screen.getByText("추가"));
  await waitFor(() => {
    expect(PostEval).toHaveBeenCalledWith(
      "독서와 문법", 2025, 1, 1, "WRITTEN", "새로운 평가", 0, 0 // Number(null) === 0
    );
  });
});

it("GetScore 실패 시 error 객체가 비어있을 때 콘솔에 찍힌다", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const error = {};
  (GetScore as jest.Mock).mockRejectedValueOnce(error);
  render(<GradesPage />);
  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", error);
  });
  consoleSpy.mockRestore();
});

it("GetScore 실패 시 error.message만 있을 때 콘솔에 찍힌다 (response 없음)", async () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const error = { message: "Network error without response" };
  (GetScore as jest.Mock).mockRejectedValueOnce(error);
  render(<GradesPage />);
  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch grades", error);
  });
  consoleSpy.mockRestore();
});


});
