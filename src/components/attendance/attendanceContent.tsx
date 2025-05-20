import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import axios from "axios";
import useSelectedDate from "@/store/selected-date-store";
import useStudentFilterStore from "@/store/student-filter-store";

interface AttendanceContentProps {
  edit: boolean;
  onSave?: (saveFunction: () => Promise<void>) => void;
}

const AttendanceContent = forwardRef<{ postAttendances: () => Promise<void> }, AttendanceContentProps>(({ edit, onSave }, ref) => {
  const { year, month } = useSelectedDate();
  const { grade, classNumber } = useStudentFilterStore();
  const [dataList, setDataList] = useState<any[]>([]);

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
        setDataList(res.data.response);
      } catch (err) {
        console.error(err);
        setDataList([]);
      }
    };
    fetchAttendances();
  }, [year, month, grade, classNumber]);

  const statusCycle = ["O", "△", "▲", "X"];
  const getNextStatus = (current: string) => {
    const idx = statusCycle.indexOf(current);
    return statusCycle[(idx + 1) % statusCycle.length];
  };

  const postAttendances = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const requestBody = {
        year,
        month,
        grade,
        classNumber,
        students: dataList.map((student) => ({
          studentId: student.studentId,
          attendances: student.attendances ?? [],
        })),
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/attendances`, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("출결 저장 완료:", res.data);
      return res.data;
    } catch (err) {
      console.error("출결 저장 실패:", err);
      throw err;
    }
  };

  useImperativeHandle(ref, () => ({
    postAttendances,
  }));

  useEffect(() => {
    if (onSave) {
      onSave(postAttendances);
    }
  }, [onSave]);

  return (
    <div className="w-full h-full border border-[#a9a9a9] overflow-x-auto">
      <div className="min-w-fit w-full">
        {/* 날짜 헤더 */}
        <div className="flex text-center w-full">
          <div className="flex w-[48px] min-w-[48px] h-8 border border-[#a9a9a9] justify-center items-center">번호</div>
          <div className="flex w-[80px] min-w-[80px] h-8 border border-[#a9a9a9] justify-center items-center">성명</div>
          {[...Array(daysInMonth)].map((_, idx) => (
            <div key={idx} className="flex flex-1 min-w-[40px] h-8 border border-[#a9a9a9] justify-center items-center">
              {month}/{idx + 1}
            </div>
          ))}
        </div>

        {/* 출석 데이터 */}
        {dataList.length === 0 && <div className="text-center p-2">출결 정보가 없습니다.</div>}
        {dataList.map((data, i) => (
          <div key={i} className="flex text-center w-full">
            <div className="flex w-[48px] min-w-[48px] h-8 border border-[#a9a9a9] justify-center items-center">{i + 1}</div>
            <div className="flex w-[80px] min-w-[80px] h-8 border border-[#a9a9a9] justify-center items-center">{data.studentName}</div>
            {[...Array(daysInMonth)].map((_, dayIdx) => {
              const day = dayIdx + 1;
              const paddedMonth = month.toString().padStart(2, "0");
              const paddedDay = day.toString().padStart(2, "0");
              const dateStr = `${year}-${paddedMonth}-${paddedDay}`;
              const currentDate = new Date(`${year}-${paddedMonth}-${paddedDay}`);
              const today = new Date();
              const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

              let symbol = "";
              let attendanceIdx = -1;
              const attendances = data.attendances ?? [];

              if (isWeekend) {
                symbol = "-";
              } else {
                if (Array.isArray(attendances)) {
                  attendanceIdx = attendances.findIndex((a: any) => a.date === dateStr);
                  if (attendanceIdx !== -1) {
                    switch (attendances[attendanceIdx].status) {
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
                } else if (currentDate <= today) {
                  symbol = "O";
                }
              }

              const handleClick = () => {
                if (!edit || isWeekend || currentDate > today) return;

                const newDataList = [...dataList];
                const target = newDataList[i];

                if (!target.attendances) {
                  target.attendances = [];
                }

                const currentStatus = symbol;
                const nextSymbol = getNextStatus(currentStatus);

                const statusMap: any = {
                  O: null,
                  "△": "EARLY",
                  "▲": "LATE",
                  X: "ABSENT",
                };

                if (nextSymbol === "O") {
                  target.attendances = target.attendances.filter((a: any) => a.date !== dateStr);
                } else {
                  if (attendanceIdx !== -1) {
                    target.attendances[attendanceIdx].status = statusMap[nextSymbol];
                  } else {
                    target.attendances.push({ date: dateStr, status: statusMap[nextSymbol] });
                  }
                }

                setDataList(newDataList);
              };

              return (
                <div key={dayIdx} className="flex flex-1 min-w-[40px] h-8 border border-[#a9a9a9] justify-center items-center select-none cursor-pointer" onClick={handleClick}>
                  <span>{symbol}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
});

AttendanceContent.displayName = "AttendanceContent";
export default AttendanceContent;
