import AttendanceContent from "@/components/attendance/attendanceContent";
import Button from "@/components/shared/Button";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import React, { ReactNode } from "react";

export default function AttendancePage() {
  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex h-8">
        <StudentFilter />
        <div className="ml-auto">
          <Button className="w-20 h-8">저장</Button>
        </div>
      </div>
      <div className="flex flex-row mt-4 flex-1">
        <AttendanceContent />
      </div>
    </div>
  );
}

AttendancePage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
