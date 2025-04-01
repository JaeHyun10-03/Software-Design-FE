import React from "react";

const studentList = [
  { studentId: 1, name: "김" },
  { studentId: 2, name: "김범" },
  { studentId: 3, name: "김범수" },
  { studentId: 4, name: "김범수수" },
];

export default function StudentList() {
  return (
    <div className="w-44 h-screen border border-gray-400 overflow-hidden">
      {/* 헤더 */}
      <div className="flex h-8 border-b border-gray-400">
        <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">번호</div>
        <div className="flex-1 flex items-center justify-center text-gray-800 text-base">이름</div>
      </div>

      {/* 리스트 */}
      {studentList.map(({ studentId, name }) => (
        <div key={studentId} className={`flex h-8 border-b border-gray-400`}>
          <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">{studentId}</div>
          <div className="flex-1 flex items-center justify-center text-gray-800 text-base">{name}</div>
        </div>
      ))}
    </div>
  );
}
