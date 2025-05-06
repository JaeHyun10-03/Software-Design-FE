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
  const [edit, setEdit] = useState(false);
  // console.log(behaviorId);
  // console.log(behavior);
  // console.log(generalOpinion);

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
        console.log("출결 데이터:", data);
      } catch (err) {
        setBehaviorId(null);
        alert(`행동 API 요청 실패 : ${err}`);
      }
    };
    getBehavior();
  }, [year, grade, classNumber, studentId]);

  const postBehavior = async () => {
    if (behaviorId) {
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/behavior?year=${year}&grade=${grade}&classNum=${classNumber}&studentId=${studentId}`,
        {
          behavior: behavior,
          generalComment: generalOpinion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data;
      console.log("행동 데이터 생성:", data);
      alert("저장되었습니다.");
    } catch (err) {
      alert(`저장 실패 : ${err}`);
    }
  };

  const putBehavior = async () => {
    if (!behavior) {
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/behavior?year=${year}&grade=${grade}&classNum=${classNumber}&studentId=${studentId}`,
        {
          behavior: behavior,
          generalComment: generalOpinion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = res.data;
      console.log("행동 데이터 수정:", data);
    } catch (err) {
      alert(`저장 실패 : ${err}`);
    }
  };

  return (
    <div className="w-full h-full border border-[#a9a9a9] p-4">
      <div className="flex flex-col gap-2">
        <p className="text-xl">행동특성</p>
        <textarea
          value={behavior}
          onChange={(e) => setBehavior(e.target.value)}
          className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-2 mt-16">
        <p className="text-xl">종합의견</p>
        <textarea
          value={generalOpinion}
          onChange={(e) => setGeneralOpinion(e.target.value)}
          className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none"
        />
        {behaviorId ? (
          <Button
            className="w-16 h-8 ml-auto"
            onClick={() => {
              putBehavior();
            }}
          >
            저장
          </Button>
        ) : (
          <Button
            className="w-16 h-8 ml-auto"
            onClick={() => {
              postBehavior();
            }}
          >
            등록
          </Button>
        )}
      </div>
    </div>
  );
};

export default BehaviorContent;
