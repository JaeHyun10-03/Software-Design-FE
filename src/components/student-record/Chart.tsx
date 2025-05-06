import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

// 데이터 타입 정의
interface SubjectGrade {
  name: string;
  석차등급?: string;
  [key: string]: any; // 추가 속성을 위한 인덱스 시그니처
}

// 차트 데이터 타입
interface ChartDataItem {
  subject: string;
  grade: number;
}

// 역변환된 차트 데이터 타입
interface InvertedChartDataItem {
  subject: string;
  invertedGrade: number;
}

// 컴포넌트 props 타입
interface GradeRadarChartProps {
  dataList: SubjectGrade[];
}

export default function GradeRadarChart({ dataList }: GradeRadarChartProps): React.ReactElement {
  // 데이터리스트가 배열인지 확인
  if (!Array.isArray(dataList)) {
    return <div className="p-4 text-center text-gray-500">데이터를 불러오는 중...</div>;
  }

  // 레이더 차트에 필요한 형식으로 데이터 변환
  // 등급 문자열을 숫자로 변환
  const chartData: ChartDataItem[] = dataList.map((item) => ({
    subject: item.name,
    grade: parseInt(item.석차등급?.split("등급")[0]) || 9, // 파싱 실패 시 기본값 9
  }));

  // 레이더 차트는 역변환된 값으로 더 잘 작동함 (1이 최고, 9가 최저)
  // 시각화를 위해 역변환 (9가 바깥쪽, 1이 중앙)
  const invertedChartData: InvertedChartDataItem[] = chartData.map((item) => ({
    subject: item.subject,
    invertedGrade: 10 - item.grade, // 1은 9가 되고, 9는 1이 됨
  }));

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-bold mb-4 text-center">성적 레이더 차트</h3>
      <div className="flex justify-center">
        <div className="w-full max-w-xl h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={invertedChartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis
                domain={[0, 9]}
                tickCount={9}
                // 등급을 역순으로 표시 (바깥쪽 = 1등급)
                tickFormatter={(value: any) => (value === 0 ? "" : String(10 - value))}
              />
              <Tooltip formatter={(value: any) => [10 - value, "등급"]} labelFormatter={(label: any) => `과목: ${label}`} />
              <Radar name="등급" dataKey="invertedGrade" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">* 차트 바깥쪽이 1등급, 안쪽으로 갈수록 9등급을 의미합니다</div>
    </div>
  );
}
