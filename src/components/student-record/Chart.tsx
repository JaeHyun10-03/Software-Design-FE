import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function GradeRadarChart({ dataList }) {
  // Check if dataList is an array
  if (!Array.isArray(dataList)) {
    return <div className="p-4 text-center text-gray-500">데이터를 불러오는 중...</div>;
  }

  // Transform dataList to format required by radar chart
  // Converting 등급 string to number for the chart
  const chartData = dataList.map((item) => ({
    subject: item.name,
    grade: parseInt(item.석차등급?.split("등급")[0]) || 9, // Default to 9 if parsing fails
  }));

  // The radar chart works better when grades are inverted (1 is best, 9 is worst)
  // So we'll invert them for visualization (9 becomes outer edge, 1 is center)
  const invertedChartData = chartData.map((item) => ({
    subject: item.subject,
    invertedGrade: 10 - item.grade, // 1 becomes 9, 9 becomes 1
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
                tickFormatter={(value) => (value === 0 ? "" : 10 - value)}
              />
              <Tooltip formatter={(value) => [10 - value, "등급"]} labelFormatter={(label) => `과목: ${label}`} />
              <Radar name="등급" dataKey="invertedGrade" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">* 차트 바깥쪽이 1등급, 안쪽으로 갈수록 9등급을 의미합니다</div>
    </div>
  );
}
