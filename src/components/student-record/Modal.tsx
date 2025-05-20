import React, { useEffect, useState } from "react";
import Button from "../shared/Button";
import axios from "axios";

interface ModalProps {
  name: string;
  onClose: () => void;
  scoreSummaryId: number;
}

export default function Modal({ name, onClose, scoreSummaryId }: ModalProps) {
  const [feedback, setFeedback] = useState("");
  const [initialFeedback, setInitialFeedback] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const getFeedback = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/score-summary/feedback/${scoreSummaryId}`, { headers: { Authorization: `Bearer ${token}` } });
        const feedbackData = res.data.response.feedback;
        setInitialFeedback(feedbackData);
        setFeedback(feedbackData || ""); // null이면 빈 문자열로
      } catch (err) {
        console.error("피드백 불러오기 실패:", err);
      }
    };
    getFeedback();
  }, [scoreSummaryId]);

  const token = localStorage.getItem("accessToken");

  const postFeedback = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/score-summary/feedback`,
        {
          scoreSummaryId,
          feedback,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("POST 성공:", res.data);
    } catch (err) {
      console.error("POST 실패:", err);
    }
  };

  const editFeedback = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/score-summary/feedback/${scoreSummaryId}`,
        { feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("editFeedback 성공:", res.data);
    } catch (err) {
      console.error("editFeedback 실패:", err);
    }
  };

  const handleSave = async () => {
    // 변경 사항 없으면 요청 없이 닫기
    if (feedback === (initialFeedback ?? "")) {
      onClose();
      return;
    }

    if (initialFeedback === null) {
      await postFeedback();
    } else {
      await editFeedback();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
      <div className="flex flex-col bg-white p-6 rounded shadow-lg w-[600px] min-h-[300px] z-100" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="flex flex-col justify-between h-80">
          <textarea
            className="w-full h-full resize-none border border-gray-300 rounded p-2"
            placeholder="피드백을 작성해주세요"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button className="mt-4 h-12" onClick={handleSave}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
