import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../shared/Button";

interface FeedbackModalProps {
  name: string;
  onClose: () => void;
  scoreSummaryId: number;
}

export default function FeedbackModal({ name, onClose, scoreSummaryId }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getFeedback = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/score-summary/feedback/${scoreSummaryId}`, { headers: { Authorization: `Bearer ${token}` } });
        setFeedback(res.data.response.feedback);
      } catch (err) {
        console.error("피드백 조회 실패:", err);
      }
    };

    getFeedback();
  }, [scoreSummaryId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
      <div className="flex flex-col bg-white p-6 rounded shadow-lg w-[600px] min-h-[300px] z-100" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{name} 피드백</h2>
        <div className="flex-1 whitespace-pre-wrap border bg-[#fffff] rounded p-4 min-h-[150px]">{feedback ? feedback : "피드백이 없습니다."}</div>
        <Button className="mt-6 h-12" onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  );
}
