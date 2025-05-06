import React from "react";
import { ConsultingData } from "@/types/counsel";
import { CounselHistoryItem } from "./CounselHistoryItem";

interface CounselHistoryListProps {
  dailyHistory: ConsultingData[];
  selectedCounselId: number | null;
  setSelectedCounselId: (id: number) => void;
  setForm: React.Dispatch<React.SetStateAction<Omit<ConsultingData, "id">>>;
}

export function CounselHistoryList({
  dailyHistory,
  selectedCounselId,
  setSelectedCounselId,
  setForm,
}: CounselHistoryListProps) {
  if (!dailyHistory.length) {
    return <div className="text-gray-500">선택한 날짜의 상담 이력이 없습니다.</div>;
  }
  return (
    <div className="flex flex-col gap-2 relative">
      {dailyHistory.map((item) => (
        <CounselHistoryItem
          key={item.id}
          item={item}
          isSelected={selectedCounselId === item.id}
          setSelectedCounselId={setSelectedCounselId}
          setForm={setForm}
        />
      ))}
    </div>
  );
}
