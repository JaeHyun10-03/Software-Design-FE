import useStudentFilterStore from "@/store/student-filter-store";
import React, { useMemo } from "react";

// 더미 데이터 -> api 완성 후 수정 예정
const A = [
  { studentId: 1, name: "김" },
  { studentId: 2, name: "김범" },
  { studentId: 3, name: "김범수" },
];

const B = [
  { studentId: 1, name: "나" },
  { studentId: 2, name: "나얼" },
  { studentId: 3, name: "나얼얼" },
];

const C = [
  { studentId: 1, name: "박" },
  { studentId: 2, name: "박효" },
  { studentId: 3, name: "박효신" },
];

export default function StudentList() {
  const { grade, classNumber, studentNumber, setStudentNumber } = useStudentFilterStore();

  // 학년 선택에 따른 학생 리스트의 데이터 변경 -> api 완성 후 수정 예정
  const currentList = useMemo(() => {
    if (grade === "1") return A;
    if (grade === "2") return B;
    if (grade === "3") return C;
    return A; // 기본값
  }, [grade, classNumber]);

  return (
    <div className="w-44 h-100% border border-gray-400 overflow-hidden">
      {/* 헤더 */}
      <div className="flex h-8 border-b border-gray-400">
        <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">번호</div>
        <div className="flex-1 flex items-center justify-center text-gray-800 text-base">이름</div>
      </div>

      {/* 리스트 */}
      {currentList.map(({ studentId, name }) => (
        <div
          key={studentId}
          className={`flex h-8 border-b border-gray-400 cursor-pointer ${studentId.toString() === studentNumber ? "bg-[#4DAAF880]" : ""}`}
          onClick={() => setStudentNumber(`${studentId}`)}
        >
          <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">{studentId}</div>
          <div className="flex-1 flex items-center justify-center text-gray-800 text-base">{name}</div>
        </div>
      ))}
    </div>
  );
}
