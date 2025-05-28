import React from "react";
import StudentFilter from "@/components/shared/StudentFilter";
import GradeFilter from "@/components/grade/GradeFilter";

export function GradeHeaderSection() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-base w-full gap-2 sm:h-8">
      <div className="flex mb-[20px]"><StudentFilter /></div>
      <div className="flex mt-[-5px] max-h-[24px]"><GradeFilter /></div>
    </div>
  );
}
