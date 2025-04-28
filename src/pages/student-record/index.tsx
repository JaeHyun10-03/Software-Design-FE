// StudentRecordPage.tsx (수정)
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import React, { ReactNode, useEffect, useState } from "react";
import Button from "@/components/shared/Button";
import useCategoryStore from "@/store/category-store";
import useAttendanceStore from "@/store/attendance-store";
import axios from "axios";

export default function StudentRecordPage() {
  const { category } = useCategoryStore();
  const { saveAttendance } = useAttendanceStore();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const studentId = 1;
    console.log("토큰:", accessToken);
    const getStudentData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students/${studentId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.data;
        console.log("데이터:", data);
      } catch (err) {
        alert(`GET : teachers/students/{studentId} API 오류 내용 : ${err}`);
      }
    };
    getStudentData();
  }, []);

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
