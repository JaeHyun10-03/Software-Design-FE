import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Grade from "@/components/student-record/category/Grade";
import axios from "axios";

// ✅ Mock: Cell 컴포넌트
jest.mock("../Cell", () => {
  const MockedCell = ({ type, children, onClick }: any) => (
    <div data-testid={`cell-${type}`} onClick={onClick}>
      {children}
    </div>
  );
  MockedCell.displayName = "MockedCell";
  return MockedCell;
});

// ✅ Mock: Modal 컴포넌트
jest.mock("../Modal", () => {
  const MockedModal = ({ onClose }: any) => (
    <div data-testid="mocked-modal">
      Modal 열림
      <button onClick={onClose}>닫기</button>
    </div>
  );
  MockedModal.displayName = "MockedModal";
  return MockedModal;
});

// ✅ Mock: GradeRadarChart 컴포넌트
jest.mock("../GradeRadarChart", () => {
  const MockedChart = ({ dataList }: any) => <div data-testid="grade-radar-chart">차트 데이터 {dataList.length}개</div>;
  MockedChart.displayName = "MockedGradeRadarChart";
  return MockedChart;
});

// ✅ Mock: useStudentFilterStore
jest.mock("@/store/student-filter-store", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    grade: 1,
    classNumber: 2,
    studentNumber: 3,
  })),
}));

describe("Grade Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("accessToken", "test-token");
  });

  it("컬럼 헤더들을 렌더링한다", () => {
    render(<Grade />);
    const headers = ["과목", "지필/수행", "고사 / 영역명(반영비율)", "만점", "받은 점수", "합계", "성취도(수강자수)", "원점수/과목평균(표준편차)", "석차등급", "석차"];
    headers.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("API 호출 후 성적 데이터를 렌더링한다", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: {
        response: {
          subjects: [
            {
              subjectName: "수학",
              evaluationMethods: [
                { examType: "WRITTEN", title: "중간", weight: 50, fullScore: 100, rawScore: 85 },
                { examType: "PRACTICAL", title: "과제", weight: 50, fullScore: 100, rawScore: 90 },
              ],
              rawTotal: 175,
              weightedTotal: 87.5,
              achievementLevel: "우수",
              totalStudentCount: 30,
              average: 80,
              stdDev: 5,
              grade: 2,
              rank: 5,
              feedback: "잘했어요",
              scoreSummaryId: 101,
            },
          ],
        },
      },
    });

    render(<Grade />);

    await waitFor(() => {
      expect(screen.getByText("수학")).toBeInTheDocument();
      expect(screen.getByText("중간 (50%)")).toBeInTheDocument();
      expect(screen.getByText("과제 (50%)")).toBeInTheDocument();
      expect(screen.getByText("85")).toBeInTheDocument();
      expect(screen.getByText("90")).toBeInTheDocument();
      expect(screen.getByText("우수 (30명)")).toBeInTheDocument();
      expect(screen.getByText("2등급")).toBeInTheDocument();
      expect(screen.getByText("5등")).toBeInTheDocument();
    });
  });

  it("과목 클릭 시 모달이 열리고 닫힌다", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: {
        response: {
          subjects: [
            {
              subjectName: "과학",
              evaluationMethods: [],
              rawTotal: 90,
              weightedTotal: 90,
              achievementLevel: "보통",
              totalStudentCount: 20,
              average: 85,
              stdDev: 3,
              grade: 3,
              rank: 4,
              feedback: "",
              scoreSummaryId: 202,
            },
          ],
        },
      },
    });

    render(<Grade />);

    await waitFor(() => {
      const subjectCell = screen.getByText("과학");
      fireEvent.click(subjectCell);
      expect(screen.getByTestId("mocked-modal")).toBeInTheDocument();

      const closeButton = screen.getByText("닫기");
      fireEvent.click(closeButton);
      expect(screen.queryByTestId("mocked-modal")).not.toBeInTheDocument();
    });
  });

  it("성적 차트 컴포넌트를 렌더링한다", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: {
        response: {
          subjects: [],
        },
      },
    });

    render(<Grade />);
    await waitFor(() => {
      expect(screen.getByTestId("grade-radar-chart")).toBeInTheDocument();
    });
  });
});
