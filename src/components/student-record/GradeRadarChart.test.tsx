import { render, screen } from "@testing-library/react";
import GradeRadarChart from "./GradeRadarChart";

const sampleData = [
  { name: "독서와 문법", 석차등급: "1등급" },
  { name: "확률과 통계", 석차등급: "2등급" },
  { name: "미적분2", 석차등급: "3등급" },
  { name: "영어1", 석차등급: "4등급" },
  { name: "한국사", 석차등급: "5등급" },
];

describe("GradeRadarChart", () => {
  it("데이터가 없으면 로딩 메시지를 보여준다", () => {
    render(<GradeRadarChart dataList={undefined as any} />);
    expect(screen.getByText("데이터를 불러오는 중...")).toBeInTheDocument();
  });

  it("레이더 차트 컨테이너가 렌더링 된다", () => {
    render(<GradeRadarChart dataList={sampleData} />);
    // 제목은 렌더링 됨
    expect(screen.getByText("성적 레이더 차트")).toBeInTheDocument();
    // 차트 컨테이너 div가 렌더링 됨 (className 체크)
    expect(document.querySelector(".recharts-responsive-container")).toBeInTheDocument();
  });
});
