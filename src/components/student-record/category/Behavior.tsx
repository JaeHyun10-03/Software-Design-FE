import React, { useEffect } from "react";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";
import useBehaviorStore from "@/store/behavior-store";

export default function Behavior() {
  const { behavior, generalComment, setBehavior, setBehaviorId, setGeneralComment } = useBehaviorStore();
  const { grade, classNumber, studentId, isReady } = useStudentFilterStore();

  useEffect(() => {
    if (!isReady) return;

    const token = localStorage.getItem("accessToken");

    const getBehavior = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/behavior?grade=${+grade}&classNum=${+classNumber}&studentId=${+studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        setBehavior(data.behavior);
        setBehaviorId(data.behaviorId);
        setGeneralComment(data.generalComment);
      } catch (err) {
        console.error("행동 정보 가져오기 오류:", err);
      }
    };

    getBehavior();
  }, [isReady, grade, classNumber, studentId]);

  return (
    <div className="flex flex-col h-full gap-4 p-8">
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">행동</label>
        <div className="focus:outline-none p-4 h-full flex-1 border border-[#a9a9a9]">{behavior}</div>
      </div>
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">태도</label>
        <div className="focus:outline-none p-4 h-full flex-1 border border-[#a9a9a9]">{generalComment}</div>
      </div>
    </div>
  );
}
