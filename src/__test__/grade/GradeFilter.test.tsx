// __tests__/components/GradeFilter.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GradeFilter from "@/components/grade/GradeFilter";
import { GetSubjects } from "@/api/getSubjects";
import { PostSubject } from "@/api/postSubject";

// Mock zustand store
jest.mock("@/store/grade-filter-store", () => ({
  __esModule: true,
  default: () => ({
    year: "2025",
    semester: "1",
    grade: "1",
    subject: "영어1",
    setYear: jest.fn(),
    setSemester: jest.fn(),
    setSubject: jest.fn(),
  }),
}));

// Mock API
jest.mock("@/api/getSubjects", () => ({
  __esModule: true,
  GetSubjects: jest.fn(),
}));
jest.mock("@/api/postSubject", () => ({
  __esModule: true,
  PostSubject: jest.fn(),
}));

// Mock AddSubjectForm
jest.mock("@/components/grade/AddSubjectForm", () => ({
  __esModule: true,
  AddSubjectForm: ({ value, onChange, onAdd, onCancel }: any) => (
    <div data-testid="add-subject-form">
      <input
        data-testid="add-subject-input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button data-testid="add-subject-add" onClick={onAdd}>추가</button>
      <button data-testid="add-subject-cancel" onClick={onCancel}>취소</button>
    </div>
  ),
}));

describe("<GradeFilter />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("과목 목록과 '+ 과목추가' 옵션을 렌더링한다", async () => {
    (GetSubjects as jest.Mock).mockResolvedValueOnce([
      { name: "영어1" },
      { name: "수학" },
    ]);
    render(<GradeFilter />);
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "영어1" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "수학" })).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "+ 과목추가" })).toBeInTheDocument();
    });
  });

  it("'+ 과목추가' 선택 시 입력폼이 노출된다", async () => {
    (GetSubjects as jest.Mock).mockResolvedValueOnce([{ name: "영어1" }]);
    render(<GradeFilter />);
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "+ 과목추가" })).toBeInTheDocument();
    });
    const subjectSelect = screen.getByLabelText("과목");
    fireEvent.change(subjectSelect, { target: { value: "+ 과목추가" } });
    expect(screen.getByTestId("add-subject-form")).toBeInTheDocument();
  });

  it("입력폼에서 추가 버튼 클릭 시 PostSubject가 호출된다", async () => {
    (GetSubjects as jest.Mock).mockResolvedValueOnce([{ name: "영어1" }]);
    (PostSubject as jest.Mock).mockResolvedValueOnce({});
    render(<GradeFilter />);
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "+ 과목추가" })).toBeInTheDocument();
    });
    const subjectSelect = screen.getByLabelText("과목");
    fireEvent.change(subjectSelect, { target: { value: "+ 과목추가" } });
    const input = screen.getByTestId("add-subject-input");
    fireEvent.change(input, { target: { value: "새과목" } });
    fireEvent.click(screen.getByTestId("add-subject-add"));
    await waitFor(() => {
      expect(PostSubject).toHaveBeenCalledWith("새과목");
    });
  });

  it("입력폼에서 취소 버튼 클릭 시 입력폼이 사라진다", async () => {
    (GetSubjects as jest.Mock).mockResolvedValueOnce([{ name: "영어1" }]);
    render(<GradeFilter />);
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "+ 과목추가" })).toBeInTheDocument();
    });
    const subjectSelect = screen.getByLabelText("과목");
    fireEvent.change(subjectSelect, { target: { value: "+ 과목추가" } });
    expect(screen.getByTestId("add-subject-form")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("add-subject-cancel"));
    expect(screen.queryByTestId("add-subject-form")).not.toBeInTheDocument();
  });
});
