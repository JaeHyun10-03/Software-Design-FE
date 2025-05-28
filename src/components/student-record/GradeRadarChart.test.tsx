import React from "react";
import { render, screen } from "@testing-library/react";
import GradeRadarChart from "./GradeRadarChart";

// 데이터 타입 정의 (컴포넌트 파일에서 import 해오는 것이 더 좋습니다)
// 여기서는 테스트 파일 내에서만 사용하므로 필요에 따라 복사했습니다.
interface SubjectGrade {
  name: string;
  석차등급?: string;
  [key: string]: any;
}

// Recharts 컴포넌트들을 목킹합니다.
// jest.mock의 두 번째 인자로 팩토리 함수를 사용하여 목킹된 모듈을 반환합니다.
// 이렇게 하면 require() 없이 import 방식으로 목킹된 RadarChart를 가져올 수 있습니다.
jest.mock("recharts", () => ({
  Radar: jest.fn(() => null),
  RadarChart: jest.fn(() => null),
  PolarGrid: jest.fn(() => null),
  PolarAngleAxis: jest.fn(() => null),
  PolarRadiusAxis: jest.fn(() => null),
  ResponsiveContainer: jest.fn(({ children }) => <div data-testid="responsive-container">{children}</div>),
  Tooltip: jest.fn(() => null),
}));

// 목킹된 RadarChart를 import 방식으로 가져옵니다.
// 이렇게 하면 `@typescript-eslint/no-require-imports` 룰을 위반하지 않습니다.
import { RadarChart } from "recharts";

// 실제 RadarChart의 타입으로 캐스팅하여 Jest Mock 함수 속성에 접근할 수 있도록 합니다.
const RadarChartMock = RadarChart as jest.Mock;

describe("GradeRadarChart", () => {
  beforeEach(() => {
    RadarChartMock.mockClear(); // 각 테스트 전에 호출 기록을 지웁니다.
  });

  const fullSampleData: SubjectGrade[] = [
    { name: "독서와 문법", 석차등급: "1등급" },
    { name: "확률과 통계", 석차등급: "2등급" },
    { name: "미적분2", 석차등급: "3등급" },
    { name: "영어1", 석차등급: "4등급" },
    { name: "한국사", 석차등급: "5등급" },
    { name: "물리학1", 석차등급: "7등급" },
    { name: "지구과학1", 석차등급: "8등급" },
  ];

  const dataWithInvalidGrade: SubjectGrade[] = [
    { name: "국어", 석차등급: "1등급" },
    { name: "수학", 석차등급: "invalid" },
  ];

  const dataWithMissingGrade: SubjectGrade[] = [
    { name: "국어", 석차등급: "1등급" },
    { name: "사회" }, // 중복된 'name' 속성 제거. '석차등급'이 없는 상태를 테스트
  ];

  const emptyData: SubjectGrade[] = []; // 명시적으로 타입 지정

  // --- 1. `if (!Array.isArray(dataList))` 브랜치 커버 ---
  it("dataList가 undefined일 때 로딩 메시지를 보여준다", () => {
    render(<GradeRadarChart dataList={undefined as any} />);
    expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
    expect(RadarChartMock).not.toHaveBeenCalled();
  });

  it("dataList가 null일 때 로딩 메시지를 보여준다", () => {
    render(<GradeRadarChart dataList={null as any} />);
    expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
    expect(RadarChartMock).not.toHaveBeenCalled();
  });

  it("dataList가 빈 배열일 때는 로딩 메시지를 보여주지 않고 차트를 렌더링 시도한다", () => {
    render(<GradeRadarChart dataList={emptyData} />);
    expect(screen.queryByText("데이터를 불러오는 중...")).not.toBeInTheDocument();
    expect(screen.getByText("성적 레이더 차트")).toBeInTheDocument();
    expect(screen.getAllByTestId("responsive-container").length).toBeGreaterThan(0);
    expect(RadarChartMock).toHaveBeenCalledTimes(2);
    expect(RadarChartMock.mock.calls[0][0].data).toEqual([]);
    expect(RadarChartMock.mock.calls[1][0].data).toEqual([]);
  });

  // --- 기본 렌더링 및 제목 확인 ---
  it("레이더 차트의 제목이 렌더링 된다", () => {
    render(<GradeRadarChart dataList={fullSampleData} />);
    expect(screen.getByText("성적 레이더 차트")).toBeInTheDocument();
    expect(screen.getByText("* 차트 바깥쪽이 1등급, 안쪽으로 갈수록 9등급을 의미합니다")).toBeInTheDocument();
  });

  it("두 개의 차트 컨테이너가 렌더링 된다", () => {
    render(<GradeRadarChart dataList={fullSampleData} />);
    expect(screen.getAllByTestId("responsive-container")).toHaveLength(2);
    expect(RadarChartMock).toHaveBeenCalledTimes(2);
  });

  // --- 2. `item.석차등급 ? parseInt(...) || 9 : 9` 브랜치 커버 ---
  it("유효한 석차등급은 올바르게 파싱되어 차트 데이터에 반영된다", () => {
    render(<GradeRadarChart dataList={fullSampleData} />);

    const allSubjectsChartData = RadarChartMock.mock.calls[0][0].data;
    expect(allSubjectsChartData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ subject: "독서와 문법", invertedGrade: 9 }), // 1등급 -> 10-1 = 9
        expect.objectContaining({ subject: "확률과 통계", invertedGrade: 8 }), // 2등급 -> 10-2 = 8
        expect.objectContaining({ subject: "한국사", invertedGrade: 5 }), // 5등급 -> 10-5 = 5
        expect.objectContaining({ subject: "지구과학1", invertedGrade: 2 }), // 8등급 -> 10-8 = 2
      ])
    );
    expect(allSubjectsChartData.length).toBe(fullSampleData.length);
  });

  it("석차등급이 유효하지 않은 문자열일 경우 9등급으로 처리된다", () => {
    render(<GradeRadarChart dataList={dataWithInvalidGrade} />);
    const allSubjectsChartData = RadarChartMock.mock.calls[0][0].data;
    expect(allSubjectsChartData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ subject: "국어", invertedGrade: 9 }), // 1등급 -> 10-1 = 9
        expect.objectContaining({ subject: "수학", invertedGrade: 1 }), // invalid -> 9등급 -> 10-9 = 1
      ])
    );
    expect(allSubjectsChartData.length).toBe(dataWithInvalidGrade.length);
  });

  it("석차등급 필드가 없는 경우 9등급으로 처리된다", () => {
    render(<GradeRadarChart dataList={dataWithMissingGrade} />);
    const allSubjectsChartData = RadarChartMock.mock.calls[0][0].data;
    expect(allSubjectsChartData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ subject: "국어", invertedGrade: 9 }), // 1등급 -> 10-1 = 9
        expect.objectContaining({ subject: "사회", invertedGrade: 1 }), // 석차등급 없음 -> 9등급 -> 10-9 = 1
      ])
    );
    expect(allSubjectsChartData.length).toBe(dataWithMissingGrade.length);
  });

  // --- 3. `coreSubjects.includes(item.subject)` 브랜치 커버 ---
  it("coreSubjects에 포함된 과목만 국영수 차트에 렌더링 된다", () => {
    render(<GradeRadarChart dataList={fullSampleData} />);
    const filteredChartDataArgument = RadarChartMock.mock.calls[1][0].data;

    const coreSubjects = ["독서와 문법", "확률과 통계", "미적분2", "영어1"];

    expect(filteredChartDataArgument.length).toBe(coreSubjects.length);

    filteredChartDataArgument.forEach((item: any) => {
      expect(coreSubjects).toContain(item.subject);
    });

    expect(filteredChartDataArgument).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ subject: "독서와 문법" }),
        expect.objectContaining({ subject: "확률과 통계" }),
        expect.objectContaining({ subject: "미적분2" }),
        expect.objectContaining({ subject: "영어1" }),
      ])
    );

    expect(filteredChartDataArgument).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ subject: "한국사" }), expect.objectContaining({ subject: "물리학1" }), expect.objectContaining({ subject: "지구과학1" })])
    );
  });
});
