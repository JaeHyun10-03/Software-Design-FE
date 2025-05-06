import React, { useEffect, useState } from "react";
import axios from "axios";
import useSelectedDate from "@/store/selected-date-store";
import useStudentFilterStore from "@/store/student-filter-store";

const AttendanceTable: React.FC = () => {
  const { year, month } = useSelectedDate();
  const { grade, classNumber } = useStudentFilterStore();
  const [dataList, setDataList] = useState<any[]>([]); // 배열로 명시

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(year, month);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances?year=${year}&grade=${grade}&classNum=${classNumber}&month=${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        console.log("출결 데이터:", data);
        setDataList(data);
      } catch (err) {
        console.error(err);
        setDataList([]); // 실패 시 빈 배열
      }
    };
    fetchAttendances();
  }, [year, month, grade, classNumber]);

  return (
    <div className="w-full h-full min-w-[600px] border border-[#a9a9a9]">
      {/* 날짜 헤더 */}
      <div className="flex flex-row text-center">
        <div className="flex w-12 h-8 border border-[#a9a9a9] justify-center items-center">
          <span>번호</span>
        </div>
        <div className="flex w-20 h-8 border border-[#a9a9a9] justify-center items-center">
          <span>성명</span>
        </div>
        {[...Array(daysInMonth)].map((_, idx) => (
          <div key={idx} className="flex flex-1 h-8 border border-[#a9a9a9] justify-center items-center">
            <span>
              {month}/{idx + 1}
            </span>
          </div>
        ))}
      </div>

      {/* 출석 데이터 */}
      {dataList.length === 0 && <div className="text-center p-2">출결 정보가 없습니다.</div>}
      {dataList.map((data, i) => (
        <div key={i} className="flex flex-row text-center">
          <div className="flex w-12 h-8 border border-[#a9a9a9] justify-center items-center">
            <span>{i + 1}</span>
          </div>
          <div className="flex w-20 h-8 border border-[#a9a9a9] justify-center items-center">
            <span>{data.studentName}</span>
          </div>
          {[...Array(daysInMonth)].map((_, dayIdx) => {
            const day = dayIdx + 1;
            const paddedMonth = month.toString().padStart(2, "0");
            const paddedDay = day.toString().padStart(2, "0");
            const dateStr = `${year}-${paddedMonth}-${paddedDay}`;

            const currentDate = new Date(`${year}-${paddedMonth}-${paddedDay}`);
            const today = new Date();

            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6; // 0: Sunday, 6: Saturday

            let symbol = "";

            if (isWeekend) {
              symbol = "-";
            } else {
              const attendances = data.attendances;
              if (attendances && Array.isArray(attendances)) {
                const attendanceRecord = attendances.find((a: any) => a.date === dateStr);
                if (attendanceRecord) {
                  switch (attendanceRecord.status) {
                    case "EARLY":
                      symbol = "△";
                      break;
                    case "LATE":
                      symbol = "▲";
                      break;
                    case "ABSENT":
                      symbol = "X";
                      break;
                    default:
                      symbol = "O";
                  }
                } else if (currentDate <= today) {
                  symbol = "O";
                }
              } else {
                if (currentDate <= today) {
                  symbol = "O";
                }
              }
            }

            return (
              <div key={dayIdx} className="flex flex-1 h-8 border border-[#a9a9a9] justify-center items-center select-none cursor-pointer">
                <span>{symbol}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AttendanceTable;
