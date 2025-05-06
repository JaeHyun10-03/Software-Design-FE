import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

// 데이터 타입 정의
interface SubjectGrade {
  name: string;
  석차등급?: string;
  [key: string]: any;
}

interface ChartDataItem {
  subject: string;
  grade: number;
}

interface InvertedChartDataItem {
  subject: string;
  invertedGrade: number;
}

interface GradeRadarChartProps {
  dataList: SubjectGrade[];
}

export default function GradeRadarChart({ dataList }: GradeRadarChartProps): React.ReactElement {
  if (!Array.isArray(dataList)) {
    return <div className="p-4 text-center text-gray-500">데이터를 불러오는 중...</div>;
  }

  const chartData: ChartDataItem[] = dataList.map((item) => ({
    subject: item.name,
    grade: item.석차등급 ? parseInt(item.석차등급.split("등급")[0]) || 9 : 9,
  }));

  const invertedChartData: InvertedChartDataItem[] = chartData.map((item) => ({
    subject: item.subject,
    invertedGrade: 10 - item.grade,
  }));

  const coreSubjects = ["독서와 문법", "확률과 통계", "미적분2", "영어1"];
  const filteredChartData: InvertedChartDataItem[] = chartData
    .filter((item) => coreSubjects.includes(item.subject))
    .map((item) => ({
      subject: item.subject,
      invertedGrade: 10 - item.grade,
    }));

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-bold mb-4 text-center">성적 레이더 차트</h3>
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
        {/* 전체 과목 차트 */}
        <div className="w-full max-w-xl h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={invertedChartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 9]} tickCount={9} tickFormatter={(v) => (v === 0 ? "" : String(10 - v))} />
              <Tooltip formatter={(value: any) => [10 - value, "등급"]} labelFormatter={(label: any) => `과목: ${label}`} />
              <Radar name="전체 과목" dataKey="invertedGrade" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 국영수 차트 */}
        <div className="w-full max-w-xl h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={filteredChartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis domain={[0, 9]} tickCount={9} tickFormatter={(v) => (v === 0 ? "" : String(10 - v))} />
              <Tooltip formatter={(value: any) => [10 - value, "등급"]} labelFormatter={(label: any) => `과목: ${label}`} />
              <Radar name="국영수" dataKey="invertedGrade" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">* 차트 바깥쪽이 1등급, 안쪽으로 갈수록 9등급을 의미합니다</div>
    </div>
  );
}
