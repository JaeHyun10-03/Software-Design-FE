import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

export default function StudentList() {
  const { grade, classNumber, studentNumber, setGrade, setClassNumber, setStudentNumber } = useStudentFilterStore();

  // 학년별 학생 목록 상태
  const [studentList, setStudentList] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const getStudentList = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data.response;
        // console.log("데이터:", data);
        setStudentList(data.students);
        setGrade(data.grade);
        setClassNumber(data.classNum);
      } catch (error) {
        console.error("학생 목록 가져오기 오류:", error);
      }
    };
    getStudentList();
  }, []);

  // 학년 선택에 따른 학생 리스트의 데이터 변경
  const currentList = useMemo(() => {
    return studentList;
  }, [grade, classNumber, studentNumber, studentList]); // 의존성 배열 수정

  return (
    <div className="w-44 h-100% border border-gray-400 overflow-hidden">
      {/* 헤더 */}
      <div className="flex h-8 border-b border-gray-400">
        <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">번호</div>
        <div className="flex-1 flex items-center justify-center text-gray-800 text-base">이름</div>
      </div>

      {/* 리스트 */}
      {currentList && currentList.length > 0 ? (
        currentList.map(({ number, name }) => (
          <div
            key={number}
            className={`flex h-8 border-b border-gray-400 cursor-pointer ${number.toString() === studentNumber ? "bg-[#4DAAF880]" : ""}`}
            onClick={() => setStudentNumber(`${number}`)}
          >
            <div className="w-12 flex items-center justify-center border-r border-gray-400 text-gray-800 text-base">{number}</div> {/* 여기 수정 */}
            <div className="flex-1 flex items-center justify-center text-gray-800 text-base">{name}</div>
          </div>
        ))
      ) : (
        <div className="flex h-8 items-center justify-center text-gray-500">학생 정보가 없습니다</div>
      )}
    </div>
  );
}
