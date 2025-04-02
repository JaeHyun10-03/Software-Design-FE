import React from "react";
import { Category } from "@/components/student-record/Category";
import StudentRecord from "./category/StudentRecord";
import Remarks from "./category/Remarks";
import Attendance from "./category/Attendance";
import Behavior from "./category/Behavior";
import Counsel from "./category/Counsel";
import useCategoryStore from "@/store/category-store";
import Grade from "./category/Grade";

export default function Content() {
  const { category } = useCategoryStore();

  return (
    <div className="w-screen h-screen border border-gray-400">
      <Category />
      {category === "학적" && <StudentRecord />}
      {category === "성적" && <Grade />}
      {category === "특기사항" && <Remarks />}
      {category === "출결" && <Attendance />}
      {category === "행동" && <Behavior />}
      {category === "상담" && <Counsel />}
    </div>
  );
}
