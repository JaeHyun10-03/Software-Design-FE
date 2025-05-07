import useSelectedDate from "@/store/selected-date-store";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

export default function StudentList() {
  const setStudentFilter = useStudentFilterStore.setState;
  const { grade, classNumber, studentNumber, setStudentNumber, setStudentId } = useStudentFilterStore();
  const { year } = useSelectedDate();

  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const getStudentList = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students?year=${year}&grade=${grade}&classNum=${classNumber}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data.response;

        setStudentList(data.students);

        // ✅ 상태를 한 번에 업데이트
        setStudentFilter({
          grade: data.grade,
          classNumber: data.classNum,
          studentNumber: data.students[0]?.number?.toString() ?? "1",
          studentId: data.students[0]?.studentId ?? "1",
          isReady: true,
        });
      } catch (error) {
        console.error("학생 목록 가져오기 오류:", error);
      }
    };

    getStudentList();
  }, []);

  const currentList = useMemo(() => {
    return studentList;
  }, [grade, classNumber, studentNumber, studentList]);

  return (
    <div className="w-44 h-100% border border-gray-400 overflow-hidden">
      <div className="flex h-8 border-b border-gray-400">
        <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">번호</div>
        <div className="flex-1 flex items-center justify-center text-gray-800 text-base">이름</div>
      </div>

      {currentList && currentList.length > 0 ? (
        currentList.map(({ studentId, number, name }) => (
          <div
            key={number}
            className={`flex h-8 border-b border-gray-400 cursor-pointer ${`${number}` === studentNumber ? "bg-[#4DAAF880]" : ""}`}
            onClick={() => {
              setStudentNumber(`${number}`);
              setStudentId(`${studentId}`);
            }}
          >
            <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">{number}</div>
            <div className="flex-1 flex items-center justify-center text-gray-800 text-base">{name}</div>
          </div>
        ))
      ) : (
        <div className="flex h-8 items-center justify-center text-gray-500">학생 정보가 없습니다</div>
      )}
    </div>
  );
}
