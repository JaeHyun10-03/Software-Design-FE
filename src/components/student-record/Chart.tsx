import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const data = [
  { subject: "국어", grade: 3 },
  { subject: "수학", grade: 2 },
  { subject: "사회", grade: 4 },
  { subject: "과학", grade: 1 },
  { subject: "영어", grade: 2 },
];

export default function GradeRadarChart(dataList: any) {
  return (
    <div className="flex">
      <RadarChart cx={200} cy={200} outerRadius={150} width={400} height={400} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis domain={[1, 5]} />
        <Radar name="등급" dataKey="grade" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </div>
  );
}
