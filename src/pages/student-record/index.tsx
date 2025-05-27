import DateFilter from "@/components/shared/DateFilter";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import useCategoryStore from "@/store/category-store";
import React, { ReactNode, useEffect, useState } from "react";

export default function StudentRecordPage() {
  const { category } = useCategoryStore();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    // 윈도우 너비 변경을 감지하는 함수
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 컴포넌트 마운트 시 윈도우 너비 초기화
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // 화면 너비가 600px 이상일 때만 StudentList 표시
  const showStudentList = windowWidth > 600;

  return (
    <div className="mx-0 sm:mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2 h-auto sm:h-8 mx-4 sm:mx-0">
        <StudentFilter />
        {category === "출결" && (
          <div className="flex flex-col sm:flex-row w-full gap-2">
            <DateFilter />
            <div className="hidden sm:flex ml-auto justify-center items-center attendance-legend gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-1">
                <span className="font-bold">O</span> <span>출석</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">X</span> <span>결석</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">▲</span> <span>지각</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">△</span> <span>조퇴</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-8 mt-4 flex-1 px-4 sm:px-0">
        {showStudentList && <StudentList />}
        <Content />
      </div>
    </div>
  );
}

StudentRecordPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
