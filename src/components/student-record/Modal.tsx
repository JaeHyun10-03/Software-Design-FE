import React from "react";
import Button from "../shared/Button";

interface ModalProps {
  name: string;
  feedback: string;
  onClose: () => void;
}

export default function Modal({ name, feedback, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow-lg min-w-[300px] min-h-60">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <div className="flex flex-col justify-between h-[200px]">
          <textarea className="w-full h-full resize-none border border-gray-300 rounded p-2" placeholder="피드백을 작성해주세요" defaultValue={feedback} />
          <Button className="mt-auto" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
