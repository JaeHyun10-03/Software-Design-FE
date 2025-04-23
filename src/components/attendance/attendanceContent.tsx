import React from "react";
import dayjs from "dayjs";

type AttendanceMark = "○" | "×" | "△" | "-" | "";

interface Student {
  id: number;
  name: string;
  attendance: AttendanceMark[];
}

const generateMarchDates = (): string[] => {
  const dates: string[] = [];
  let current = dayjs("2025-03-01");
  const end = dayjs("2025-03-31");

  while (current.isBefore(end) || current.isSame(end)) {
    dates.push(current.format("M/D"));
    current = current.add(1, "day");
  }

  return dates;
};

const dates = generateMarchDates();

const students: Student[] = [
  { id: 1, name: "김", attendance: Array(dates.length).fill("-") },
  { id: 2, name: "김범", attendance: Array(dates.length).fill("○") },
  { id: 3, name: "김범수", attendance: Array(dates.length).fill("○") },
];

const AttendanceTable: React.FC = () => {
  return (
    <div className="w-full overflow-x-auto">
      <div style={{ minWidth: "600px" }} className="w-full">
        {/* Header Row */}
        <div className="flex font-semibold text-base text-gray-800 sticky top-0 z-10 bg-white">
          <div className="min-w-10 h-8 flex justify-center items-center border border-gray-400 text-center bg-white">번호</div>
          <div className="min-w-20 h-8 flex justify-center items-center border border-gray-400 text-center bg-white">성명</div>
          <div className="flex flex-1">
            {dates.map((date, i) => (
              <div key={i} className="flex-1 min-w-9 h-8 flex justify-center items-center border border-gray-400 text-base text-gray-800 whitespace-nowrap">
                {date}
              </div>
            ))}
          </div>
        </div>

        {/* Student Rows */}
        {students.map((student) => (
          <div className="flex text-base text-gray-800" key={student.id}>
            <div className="min-w-10 h-8 flex justify-center items-center border border-gray-400 text-center">{student.id}</div>
            <div className="min-w-20 h-8 flex justify-center items-center border border-gray-400 text-center">{student.name}</div>
            <div className="flex flex-1">
              {student.attendance.map((mark, i) => (
                <div key={i} className="flex-1 min-w-9 h-8 flex justify-center items-center border border-gray-400 text-center select-none">
                  {mark}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;
