import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import axios from "axios";
import GradePage from "@/pages/student/grade";
import useStudent from "@/store/student-store";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock 하위 컴포넌트들
function MockCell({ children, onClick }: any) {
  return (
    <div data-testid="cell" onClick={onClick}>
      {children}
    </div>
  );
}
jest.mock("@/components/student-record/Cell", () => MockCell);

function MockGradeRadarChart() {
  return <div data-testid="grade-radar-chart">Radar Chart</div>;
}
jest.mock("@/components/student-record/GradeRadarChart", () => MockGradeRadarChart);

function MockFeedbackModal({ name, onClose }: any) {
  return (
    <div data-testid="feedback-modal">
      Modal: {name}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
jest.mock("@/components/student/FeedbackModal", () => MockFeedbackModal);

function MockStudentHeader({ children }: { children: React.ReactNode }) {
  return <div data-testid="student-header">{children}</div>;
}
jest.mock("@/components/shared/StudentHeader", () => MockStudentHeader);

jest.mock("@/store/student-store");

// ResizeObserver mock
function mockResizeObserver() {
  return {
    observe: jest.fn(),
    disconnect: jest.fn(),
    unobserve: jest.fn(),
  };
}
global.ResizeObserver = mockResizeObserver;

const mockData = {
  response: {
    subjects: [
      {
        subjectName: "수학",
        evaluationMethods: [
          { examType: "PRACTICAL", title: "과제", weight: 30, fullScore: 30, rawScore: 28 },
          { examType: "WRITTEN", title: "시험", weight: 70, fullScore: 70, rawScore: 65 },
        ],
        rawTotal: 95,
        weightedTotal: 93,
        achievementLevel: "A",
        totalStudentCount: 30,
        average: 80,
        stdDev: 5,
        grade: "1",
        rank: 2,
        feedback: "잘했어요",
        scoreSummaryId: 123,
      },
    ],
  },
};

function beforeEachSetup() {
  (useStudent as jest.Mock).mockReturnValue({
    grade: 3,
    classNumber: 2,
    studentNumber: 1,
  });
}

function afterEachCleanup() {
  jest.clearAllMocks();
}

async function testApiCallRenderAndModal() {
  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });

  render(<GradePage />);

  expect(await screen.findAllByTestId("cell")).not.toHaveLength(0);

  expect(await screen.findByText("수학")).toBeInTheDocument();

  expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument();

  fireEvent.click(screen.getByText("수학"));

  expect(await screen.findByTestId("feedback-modal")).toBeInTheDocument();
  expect(screen.getByText(/Modal: 수학/)).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));

  await waitFor(() => {
    expect(screen.queryByTestId("feedback-modal")).not.toBeInTheDocument();
  });
}

async function testCellTypeChangeForSmallScreen() {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });

  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  render(<GradePage />);

  expect(await screen.findAllByTestId("cell")).not.toHaveLength(0);

  const mathElement = await screen.findByText("수학", { exact: false });

  expect(mathElement).toBeInTheDocument();

  fireEvent.click(mathElement);
  expect(await screen.findByTestId("feedback-modal")).toBeInTheDocument();
}

async function testGradeRadarChartRender() {
  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  render(<GradePage />);

  expect(await screen.findByTestId("grade-radar-chart")).toBeInTheDocument();
}

async function testWindowResizeHandling() {
  mockedAxios.get.mockResolvedValueOnce({ data: mockData });

  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });

  render(<GradePage />);

  expect(await screen.findByText("수학")).toBeInTheDocument();

  await act(async () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(new Event("resize"));
  });

  expect(screen.getByText("수학", { exact: false })).toBeInTheDocument();
}

describe("GradePage", () => {
  beforeEach(beforeEachSetup);
  afterEach(afterEachCleanup);

  it("API 호출 후 데이터가 렌더링되고 모달 열고 닫기 동작 테스트", testApiCallRenderAndModal);

  it("화면 너비가 600 이하일 때 셀 타입 변경 테스트", testCellTypeChangeForSmallScreen);

  it("GradeRadarChart 렌더링 확인", testGradeRadarChartRender);

  it("윈도우 리사이즈 이벤트 처리 테스트", testWindowResizeHandling);
});
