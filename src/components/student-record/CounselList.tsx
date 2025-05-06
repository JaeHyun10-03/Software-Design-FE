import { useEffect, useState } from "react";
import CounselCard from "./CounselCard";
import axios from "axios";
import useStudentFilterStore from "@/store/student-filter-store";

const cards = [
  {
    date: "2025.03.24.",
    subject: "OOOO",
    teacher: "OOO",
    content: "예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  ",
  },
  {
    date: "2025.05.01.",
    subject: "OOOO",
    teacher: "OOO",
    content: "예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  ",
  },
  {
    date: "2025.07.15.",
    subject: "OOOO",
    teacher: "OOO",
    content: "예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  예시입니다!  ",
  },
];

export default function CounselList() {
  const { studentId } = useStudentFilterStore();
  const [cardList, setCardList] = useState([]);
  useEffect(() => {
    const getCounsel = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/counsel?studentId=${Number(studentId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.response;
        console.log(data);
        setCardList(data);
      } catch (err) {
        console.error(err);
      }
    };
    getCounsel();
  }, []);

  return (
    <div className="flex flex-col">
      {cards.map((card, index) => (
        <CounselCard key={index} {...card} />
      ))}
    </div>
  );
}
