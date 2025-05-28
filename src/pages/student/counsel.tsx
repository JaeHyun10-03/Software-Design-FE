// pages/student/counsel.tsx
import { useEffect, useState } from "react";
import { StudentHeader } from "@/components/shared/StudentHeader";
import { ReactNode } from "react";
import axios from "axios";
import CounselCard from "@/components/student-record/CounselCard";
import useStudent from "@/store/student-store";

interface CounselingData {
  id: number;
  dateTime: string;
  category: string;
  teacher: string;
  content: string;
  nextPlan: string;
  isPublic: boolean;
}

const CounselPage = () => {
  const { grade, classNumber, studentId } = useStudent();
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
        setCardList(data);
      } catch (err) {
        console.error("상담 데이터 불러오기 오류:", err);
        setError("권한이 없습니다. 관리자에게 문의해주십시오");
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
    <div className="sm:m-0 m-4 flex flex-col gap-4">
      {cardList.map((card) => (
        <CounselCard
          key={card.id}
          id={card.id}
          dateTime={card.dateTime}
          category={card.category}
          teacher={card.teacher}
          content={card.content}
          nextPlan={card.nextPlan}
          isPublic={card.isPublic}
        />
      ))}
    </div>
  );
};

export default CounselPage;

CounselPage.getLayout = (page: ReactNode) => {
  return <StudentHeader>{page}</StudentHeader>;
};
