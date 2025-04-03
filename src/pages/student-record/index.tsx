import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import React, { ReactNode } from "react";

export default function StudentRecordPage() {
  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      {/* 헤더 높이를 제외한 전체 화면을 차지하도록 변경 */}
      <StudentFilter />
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
