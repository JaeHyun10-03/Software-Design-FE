import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import React, { ReactNode } from "react";

export default function StudentRecordPage() {
  return (
    <div className="mx-8 mt-4 mb-8">
      <StudentFilter></StudentFilter>
      <div className="flex flex-row gap-8 mt-4">
        <StudentList />
        <Content></Content>
      </div>
    </div>
  );
}

StudentRecordPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
