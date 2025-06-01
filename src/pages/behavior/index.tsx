import BehaviorContent from "@/components/behavior/BehaviorContent";
import DateFilter from "@/components/shared/DateFilter";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import React, { ReactNode } from "react";

export default function BehaviorPage() {
  return (
    <div className="mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col mx-4 sm:mx-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:">
        <StudentFilter />
        <DateFilter />
      </div>
      <div className="flex flex-row gap-8 mt-4 flex-1">
        <div className="hidden sm:flex">
          <StudentList />
        </div>
        <BehaviorContent />
      </div>
    </div>
  );
}

BehaviorPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
