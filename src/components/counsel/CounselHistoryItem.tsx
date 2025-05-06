import React from "react";
import { ConsultingData } from "@/types/counsel";
import { categoryMap } from "@/utils/categoryMap";

interface CounselHistoryItemProps {
  item: ConsultingData;
  isSelected: boolean;
  setSelectedCounselId: (id: number) => void;
  setForm: React.Dispatch<React.SetStateAction<Omit<ConsultingData, "id">>>;
}

export function CounselHistoryItem({
  item,
  isSelected,
  setSelectedCounselId,
  setForm,
}: CounselHistoryItemProps) {
  return (
    <div
      className={`border rounded px-4 py-2 bg-gray-50 text-sm cursor-pointer relative ${
        isSelected ? "border-blue-500 bg-blue-50" : ""
      }`}
    >
      <div
        className={`${!item.isPublic ? "blur-sm pointer-events-none" : ""}`}
        onClick={() => {
          setSelectedCounselId(item.id);
          setForm({
            dateTime: item.dateTime,
            category: item.category,
            teacher: item.teacher,
            content: item.content,
            isPublic: item.isPublic,
            nextPlan: item.nextPlan
          });
        }}
      >
        <div className="font-medium">{categoryMap[item.category] ?? item.category}</div>
        <div className="text-xs text-gray-500">담당 교사: {item.teacher}</div>
        <div className="text-xs text-gray-500">
          {item.content.length > 30 ? item.content.slice(0, 30) + "..." : item.content}
        </div>
      </div>
      {!item.isPublic && (
        <button
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-white/50 z-10 text-blue-600 hover:text-blue-800 text-xs"
          onClick={() => {
            setSelectedCounselId(item.id);
            setForm({ ...item });
          }}
        >
          상담이 비공개입니다.
        </button>
      )}
    </div>
  );
}
