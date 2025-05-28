import React, { useEffect, useState } from "react";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";
import { GetBehavior } from "@/api/student/getBehavior";
const BehaviorContent = () => {
  const { grade, classNumber, studentId } = useStudentFilterStore();
  const { year } = useSelectedDate();
  const [behavior, setBehavior] = useState("");
  const [generalOpinion, setGeneralOpinion] = useState("");
  // console.log(behaviorId);
  // console.log(behavior);
  // console.log(generalOpinion);

  useEffect(() => {
    const getBehavior = async () => {
      try {
        const res = await GetBehavior(year, Number(grade), Number(classNumber), Number(studentId));
        const data = res;
        setBehavior(data.behavior);
        setGeneralOpinion(data.generalComment);
        console.log("행동 데이터:", data);
      } catch (err) {
        console.error(err);
      }
    };
    getBehavior();
  }, [year, grade, classNumber, studentId]);

  return (
    <div className="w-full h-full scroll-auto p-4 pt-0 pb-0">
      <div className="flex flex-col gap-2">
        <p className="text-xl">행동특성</p>
        <textarea readOnly value={behavior} className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none" />
      </div>
      <div className="flex flex-col gap-2 mt-14">
        <p className="text-xl">종합의견</p>
        <textarea readOnly value={generalOpinion} className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 pb-0 focus:outline-none" />
      </div>
    </div>
  );
};

export default BehaviorContent;
