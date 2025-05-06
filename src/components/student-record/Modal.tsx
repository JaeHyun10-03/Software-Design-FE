import React, { useEffect, useState } from "react";
import Button from "../shared/Button";
import axios from "axios";

interface ModalProps {
  name: string;
  onClose: () => void;
}

export default function Modal({ name, onClose }: ModalProps) {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const getFeedback = async () => {
      try {
         await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
       
      } catch (err) {
        console.error(err);
      }
    };
    getFeedback();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50" onClick={onClose}>
      <div className="flex flex-col bg-white p-6 rounded shadow-lg w-[600px] min-h-[300px] z-100" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="flex flex-col justify-between h-80">
          <textarea
            className="w-full h-full resize-none border border-gray-300 rounded p-2 select-none"
            placeholder="피드백을 작성해주세요"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <Button className="mt-4 h-12" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}