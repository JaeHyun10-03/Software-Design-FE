import useStudentFilterStore from "@/store/student-filter-store";
import React, { useMemo } from "react";

export default function StudentList() {
  const { students, studentNumber, setStudentNumber, setStudentId } = useStudentFilterStore();

  const currentList = useMemo(() => students, [students]);

  return (
    <div className="w-44 h-full border border-gray-400 overflow-hidden">
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
