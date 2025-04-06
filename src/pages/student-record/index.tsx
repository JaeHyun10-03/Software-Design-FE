// StudentRecordPage.tsx (수정)
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import React, { ReactNode, useState } from "react";
import Button from "@/components/shared/Button";
import useCategoryStore from "@/store/category-store";
import useAttendanceStore from "@/store/attendance-store";

export default function StudentRecordPage() {
  const { category } = useCategoryStore();
  const { saveAttendance } = useAttendanceStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveAttendance();
      console.log("출석 저장 결과:", result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex h-8">
        <StudentFilter />
        {category === "출결" && (
          <div className="ml-auto flex items-center gap-4">
            <Button className="w-20 h-8" onClick={handleSave} disabled={isSaving}>
              저장
            </Button>
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
