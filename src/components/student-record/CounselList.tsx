// CounselList.tsx
import { useEffect, useState } from "react";
import CounselCard from "./CounselCard";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";

interface CounselingData {
  id: number;
  dateTime: string;
  category: string;
  teacher: string;
  content: string;
  nextPlan: string;
  isPublic: boolean;
}

export default function CounselList() {
  const { grade, classNumber, studentId } = useStudentFilterStore();
  const [cardList, setCardList] = useState<CounselingData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCounsel = async () => {
      setError(null);
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/counsel?studentId=${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        console.log("상담 데이터:", data);
        setCardList(data);
      } catch (err) {
        console.error("상담 데이터 불러오기 오류:", err);
        setError("상담 데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (studentId) {
      getCounsel();
    }
  }, [grade, classNumber, studentId]);

  if (error) {
    return <div className="flex justify-center items-center p-4 text-red-500">{error}</div>;
  }

  if (cardList.length === 0) {
    return <div className="flex justify-center items-center p-4">상담 기록이 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {cardList.map((card) => (
        <CounselCard
          key={card.id}
          id={card.id}
          dateTime={card.dateTime}
          category={card.category}
          teacher={card.teacher}
          content={card.content}
          nextPlan={card.nextPlan}
          isPublic={true}
        />
      ))}
    </div>
  );
}
