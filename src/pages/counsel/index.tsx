import CounselContent from "@/components/counsel/counselContent";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import React, { ReactNode } from "react";

export default function BehaviorPage() {
  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex h-8">
        <StudentFilter />
      </div>
      <div className="flex flex-row gap-8 mt-4 flex-1">
        <StudentList />
       <CounselContent/>
      </div>
    </div>
  );
}

BehaviorPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
