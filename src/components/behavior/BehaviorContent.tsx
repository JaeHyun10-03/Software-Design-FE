import React, { useEffect, useState } from "react";
import Button from "../shared/Button";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";

const BehaviorContent = () => {
  const { grade, classNumber, studentId } = useStudentFilterStore();
  const { year } = useSelectedDate();
  const [behavior, setBehavior] = useState("");
  const [generalOpinion, setGeneralOpinion] = useState("");
  const [behaviorId, setBehaviorId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getBehavior = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/behavior?year=${year}&grade=${grade}&classNum=${classNumber}&studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        setBehavior(data.behavior);
        setGeneralOpinion(data.generalComment);
        setBehaviorId(data.behaviorId);
      } catch (err) {
        setBehaviorId(null);
        console.error(err);
      }
    };
    getBehavior();
  }, [year, grade, classNumber, studentId]);

  const postBehavior = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/behavior?year=${year}&grade=${grade}&classNum=${classNumber}&studentId=${studentId}`,
        {
          behavior,
          generalComment: generalOpinion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("행동 데이터 생성:", res.data);
    } catch (err) {
      console.error(`생성 실패 : ${err}`);
    }
  };

  const putBehavior = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/behavior/${behaviorId}`,
        {
          behavior,
          generalComment: generalOpinion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error(`수정 실패 : ${err}`);
    }
  };

  const handleSave = async () => {
    if (behaviorId) {
      await putBehavior();
    } else {
      await postBehavior();
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full h-full border border-[#a9a9a9] p-4">
      <div className="flex flex-col gap-2">
        <p className="text-xl">행동특성</p>
        <textarea
          value={behavior}
          onChange={(e) => setBehavior(e.target.value)}
          readOnly={!isEditing}
          className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-2 mt-16">
        <p className="text-xl">종합의견</p>
        <textarea
          value={generalOpinion}
          onChange={(e) => setGeneralOpinion(e.target.value)}
          readOnly={!isEditing}
          className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none"
        />
        <div className="flex gap-2 justify-end mt-2">
          {isEditing ? (
            <Button className="w-16 h-8" onClick={handleSave}>
              저장
            </Button>
          ) : (
            <Button className="w-16 h-8" onClick={() => setIsEditing(true)}>
              수정
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BehaviorContent;
