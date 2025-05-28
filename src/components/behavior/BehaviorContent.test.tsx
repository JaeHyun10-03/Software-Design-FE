import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BehaviorContent from "./BehaviorContent";
import axios from "axios";

// Mock dependencies
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the custom hooks
jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: () => ({
    grade: 1,
    classNumber: 1,
    studentId: 1,
  }),
}));

jest.mock("@/store/selected-date-store", () => ({
  __esModule: true,
  default: () => ({
    year: 2024,
  }),
}));

// Mock the Button component
jest.mock("../shared/Button", () => {
  return function MockButton({ children, onClick, className }: any) {
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
  };
});

// Mock environment variable
process.env.NEXT_PUBLIC_BACKEND_DOMAIN = "http://localhost:3000";

describe("BehaviorContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // localStorage mock
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "mocked_token"),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
    // console.error mock to suppress error logs in tests
    jest.spyOn(console, "error").mockImplementation(() => {});
    // alert mock
    global.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("수정 버튼 클릭 시 textarea가 편집 가능해지고 저장 버튼이 보인다", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: {
          behavior: "성실하게 생활함",
          generalComment: "종합적으로 우수함",
          behaviorId: 1,
        },
      },
    });

    render(<BehaviorContent />);

    // 데이터 로딩 대기
    await waitFor(() => {
      expect(screen.getByDisplayValue("성실하게 생활함")).toBeInTheDocument();
    });

    // 초기 상태에서 textarea가 readonly임을 확인
    const behaviorTextarea = screen.getByLabelText(/행동특성/i);
    const opinionTextarea = screen.getByLabelText(/종합의견/i);

    expect(behaviorTextarea).toHaveAttribute("readonly");
    expect(opinionTextarea).toHaveAttribute("readonly");

    // 수정 버튼 클릭 (div with role="button")
    const editButton = screen.getByRole("button");
    fireEvent.click(editButton);

    // textarea가 편집 가능해졌는지 확인
    expect(behaviorTextarea).not.toHaveAttribute("readonly");
    expect(opinionTextarea).not.toHaveAttribute("readonly");

    // 저장 버튼이 보이는지 확인
    expect(screen.getByText("저장")).toBeInTheDocument();
  });

  test("입력한 내용을 저장 버튼 클릭 시 POST 호출 (신규 생성)", async () => {
    // GET 요청 시 빈 데이터 반환 (신규 생성 케이스)
    mockedAxios.get.mockRejectedValueOnce(new Error("Not found"));
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        response: { behaviorId: 2 },
      },
    });

    render(<BehaviorContent />);

    // GET 요청 완료 대기
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    // 수정 모드 진입
    const editButton = screen.getByRole("button");
    fireEvent.click(editButton);

    const behaviorTextarea = screen.getByLabelText(/행동특성/i);
    const opinionTextarea = screen.getByLabelText(/종합의견/i);

    fireEvent.change(behaviorTextarea, { target: { value: "새로운 행동" } });
    fireEvent.change(opinionTextarea, { target: { value: "새로운 의견" } });

    const saveButton = screen.getByText("저장");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:3000/behavior?year=2024&grade=1&classNum=1&studentId=1",
        {
          behavior: "새로운 행동",
          generalComment: "새로운 의견",
        },
        {
          headers: { Authorization: "Bearer mocked_token" },
        }
      );
    });
  });

  test("입력한 내용을 저장 버튼 클릭 시 PUT 호출 (수정)", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: {
          behavior: "기존 행동",
          generalComment: "기존 의견",
          behaviorId: 123,
        },
      },
    });
    mockedAxios.put.mockResolvedValueOnce({
      data: { message: "수정 성공" },
    });

    render(<BehaviorContent />);

    // 데이터 로딩 대기
    await waitFor(() => {
      expect(screen.getByDisplayValue("기존 행동")).toBeInTheDocument();
    });

    // 수정 모드 진입
    const editButton = screen.getByRole("button");
    fireEvent.click(editButton);

    const behaviorTextarea = screen.getByLabelText(/행동특성/i);
    const opinionTextarea = screen.getByLabelText(/종합의견/i);

    fireEvent.change(behaviorTextarea, { target: { value: "수정된 행동" } });
    fireEvent.change(opinionTextarea, { target: { value: "수정된 의견" } });

    const saveButton = screen.getByText("저장");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        "http://localhost:3000/behavior/123",
        {
          behavior: "수정된 행동",
          generalComment: "수정된 의견",
        },
        {
          headers: { Authorization: "Bearer mocked_token" },
        }
      );
    });
  });

  test("키보드 접근성 - Enter 키로 수정 버튼 활성화", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        response: {
          behavior: "기존 행동",
          generalComment: "기존 의견",
          behaviorId: 123,
        },
      },
    });

    render(<BehaviorContent />);

    // 데이터 로딩 대기
    await waitFor(() => {
      expect(screen.getByDisplayValue("기존 행동")).toBeInTheDocument();
    });

    const editButton = screen.getByRole("button");

    // Enter 키로 수정 모드 진입
    fireEvent.keyDown(editButton, { key: "Enter" });

    // textarea가 편집 가능해졌는지 확인
    const behaviorTextarea = screen.getByLabelText(/행동특성/i);
    expect(behaviorTextarea).not.toHaveAttribute("readonly");
  });

  test("API 호출 실패 시 에러 처리", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    render(<BehaviorContent />);

    // 에러 발생 시에도 컴포넌트가 정상 렌더링되는지 확인
    await waitFor(() => {
      expect(screen.getByLabelText(/행동특성/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/종합의견/i)).toBeInTheDocument();
    });

    // 에러 로그가 출력되었는지 확인
    expect(console.error).toHaveBeenCalled();
  });
});
