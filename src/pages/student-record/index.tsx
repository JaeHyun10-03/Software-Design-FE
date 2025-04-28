// StudentRecordPage.tsx (수정)
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import Content from "@/components/student-record/Content";
import React, { ReactNode, useEffect } from "react";
import axios from "axios";

export default function StudentRecordPage() {
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

  return (
    <div className="mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex h-8">
        <StudentFilter />
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
