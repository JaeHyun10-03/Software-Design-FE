// __tests__/pages/student/counsel.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import CounselPage from "@/pages/student/counsel";
import useStudent from "@/store/student-store";

// Mock dependencies
jest.mock("axios");
jest.mock("@/store/student-store");
jest.mock("@/components/shared/StudentHeader", () => {
  return {
    StudentHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="student-header">{children}</div>,
  };
});
jest.mock("@/components/student-record/CounselCard", () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid="counsel-card" data-id={props.id}>
        <div>{props.teacher}</div>
        <div>{props.category}</div>
        <div>{props.content}</div>
        <div>{props.nextPlan}</div>
        <div>{props.dateTime}</div>
        <div>{props.isPublic ? "Public" : "Private"}</div>
      </div>
    ),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedUseStudent = useStudent as jest.MockedFunction<typeof useStudent>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("CounselPage", () => {
  const mockStudentData = {
    grade: 1,
    classNumber: 2,
    studentId: 123,
  };

  const mockCounselingData = [
    {
      id: 1,
      dateTime: "2024-01-15T10:00:00",
      category: "진로상담",
      teacher: "김선생님",
      content: "진로에 대한 고민을 나누었습니다.",
      nextPlan: "다음 주에 진로 검사를 실시할 예정입니다.",
      isPublic: true,
    },
    {
      id: 2,
      dateTime: "2024-01-10T14:30:00",
      category: "학습상담",
      teacher: "이선생님",
      content: "수학 성적 향상 방안을 논의했습니다.",
      nextPlan: "보충학습을 진행할 예정입니다.",
      isPublic: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue("mock-token");
    mockedUseStudent.mockReturnValue(mockStudentData);
  });

  describe("성공적인 데이터 로딩", () => {
    it("상담 데이터를 성공적으로 불러와서 표시해야 한다", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { response: mockCounselingData },
      });

      render(<CounselPage />);

      await waitFor(() => {
        expect(screen.getAllByTestId("counsel-card")).toHaveLength(2);
      });

      // 모든 상담 카드가 렌더링되는지 확인
      const counselCards = screen.getAllByTestId("counsel-card");
      expect(counselCards).toHaveLength(2);

      // 첫 번째 카드 내용 확인
      expect(screen.getByText("김선생님")).toBeInTheDocument();
      expect(screen.getByText("진로상담")).toBeInTheDocument();
      expect(screen.getByText("진로에 대한 고민을 나누었습니다.")).toBeInTheDocument();

      // 두 번째 카드 내용 확인
      expect(screen.getByText("이선생님")).toBeInTheDocument();
      expect(screen.getByText("학습상담")).toBeInTheDocument();
      expect(screen.getByText("수학 성적 향상 방안을 논의했습니다.")).toBeInTheDocument();
    });

    it("올바른 API 호출을 해야 한다", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { response: mockCounselingData },
      });

      render(<CounselPage />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/counsel?studentId=${mockStudentData.studentId}`, {
          headers: { Authorization: "Bearer mock-token" },
        });
      });
    });
  });

  describe("에러 처리", () => {
    it("API 호출 실패 시 에러 메시지를 표시해야 한다", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

      render(<CounselPage />);

      await waitFor(() => {
        expect(screen.getByText("권한이 없습니다. 관리자에게 문의해주십시오")).toBeInTheDocument();
      });

      expect(screen.getByText("권한이 없습니다. 관리자에게 문의해주십시오")).toHaveClass("text-red-500");
    });

    it("에러 상황에서 콘솔에 에러를 로그해야 한다", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const mockError = new Error("Network Error");

      mockedAxios.get.mockRejectedValueOnce(mockError);

      render(<CounselPage />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("상담 데이터 불러오기 오류:", mockError);
      });

      consoleSpy.mockRestore();
    });
  });

  describe("빈 데이터 처리", () => {
    it("상담 기록이 없을 때 적절한 메시지를 표시해야 한다", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { response: [] },
      });

      render(<CounselPage />);

      await waitFor(() => {
        expect(screen.getByText("상담 기록이 없습니다.")).toBeInTheDocument();
      });
    });
  });

  describe("조건부 렌더링", () => {
    it("studentId가 없을 때 API를 호출하지 않아야 한다", () => {
      mockedUseStudent.mockReturnValue({
        grade: 1,
        classNumber: 2,
        studentId: null, // studentId가 없는 경우
      });

      render(<CounselPage />);

      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("studentId가 있을 때만 API를 호출해야 한다", async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { response: [] },
      });

      render(<CounselPage />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalled();
      });
    });
  });

  describe("레이아웃", () => {
    it("StudentHeader 레이아웃이 적용되어야 한다", () => {
      const MockedPage = CounselPage as any;
      const layout = MockedPage.getLayout(<div>Test Content</div>);

      const { container } = render(layout);

      expect(container.querySelector('[data-testid="student-header"]')).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });
  });

  describe("useEffect 의존성", () => {
    it("grade, classNumber, studentId 변경 시 API를 다시 호출해야 한다", async () => {
      mockedAxios.get.mockResolvedValue({
        data: { response: mockCounselingData },
      });

      const { rerender } = render(<CounselPage />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      });

      // studentId 변경
      mockedUseStudent.mockReturnValue({
        grade: 1,
        classNumber: 2,
        studentId: 456, // 변경된 studentId
      });

      rerender(<CounselPage />);

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("토큰 처리", () => {
    it("localStorage에서 토큰을 가져와서 Authorization 헤더에 포함해야 한다", async () => {
      const customToken = "custom-access-token";
      localStorageMock.getItem.mockReturnValue(customToken);

      mockedAxios.get.mockResolvedValueOnce({
        data: { response: mockCounselingData },
      });

      render(<CounselPage />);

      await waitFor(() => {
        expect(localStorageMock.getItem).toHaveBeenCalledWith("accessToken");
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), {
          headers: { Authorization: `Bearer ${customToken}` },
        });
      });
    });
  });
});

// 통합 테스트
describe("CounselPage Integration", () => {
  it("전체 플로우가 정상적으로 작동해야 한다", async () => {
    const mockData = [
      {
        id: 1,
        dateTime: "2024-01-15T10:00:00",
        category: "진로상담",
        teacher: "김선생님",
        content: "진로 고민 상담",
        nextPlan: "진로 검사 예정",
        isPublic: true,
      },
    ];

    mockedUseStudent.mockReturnValue({
      grade: 1,
      classNumber: 2,
      studentId: 123,
    });

    localStorageMock.getItem.mockReturnValue("valid-token");
    mockedAxios.get.mockResolvedValueOnce({
      data: { response: mockData },
    });

    render(<CounselPage />);

    // 로딩 완료 대기
    await waitFor(() => {
      expect(screen.getAllByTestId("counsel-card")).toHaveLength(1);
    });

    // 데이터가 올바르게 표시되는지 확인
    expect(screen.getByText("김선생님")).toBeInTheDocument();
    expect(screen.getByText("진로상담")).toBeInTheDocument();
    expect(screen.getByText("진로 고민 상담")).toBeInTheDocument();
    expect(screen.getByText("진로 검사 예정")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();

    // API 호출 확인
    expect(mockedAxios.get).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/counsel?studentId=123`, {
      headers: { Authorization: "Bearer valid-token" },
    });
  });
});
