import AttendanceContent from "@/components/attendance/attendanceContent";
import DateFilter from "@/components/shared/DateFilter";
import AttendanceType from "@/components/shared/AttendanceType";
import Button from "@/components/shared/Button";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import React, { ReactNode, useState } from "react";

export default function AttendancePage() {
  const [edit, setEdit] = useState(false);
  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex h-8 gap-4">
        <StudentFilter />
        <DateFilter></DateFilter>

        <div className="flex flex-row gap-4 ml-auto">
          <div className="hidden lg:flex">
            <AttendanceType />
          </div>
          {edit ? (
            <Button
              onClick={() => {
                setEdit(false);
              }}
              className="w-20 h-8"
            >
              저장
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEdit(true);
              }}
              className="w-20 h-8"
            >
              수정
            </Button>
          )}
        </div>
      </div>
      <div className="flex flex-row mt-4 flex-1">
        <AttendanceContent edit={edit} />
      </div>
    </div>
  );
}

AttendancePage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
