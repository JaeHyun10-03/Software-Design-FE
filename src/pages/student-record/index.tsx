// StudentRecordPage.tsx (수정)
import DateFilter from "@/components/shared/DateFilter";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import useCategoryStore from "@/store/category-store";
import React, { ReactNode } from "react";

export default function StudentRecordPage() {
  const { category } = useCategoryStore();
  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex h-8">
        <StudentFilter />
        {category === "출결" && (
          <div className="flex flex-row w-full">
            <DateFilter></DateFilter>{" "}
            <div className="flex ml-auto justify-center items-center attendance-legend gap-4 flex-wrap text-sm">
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
      <div className="flex flex-row gap-8 mt-4 flex-1">
        <StudentList />
        <Content />
      </div>
    </div>
  );
}

StudentRecordPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
