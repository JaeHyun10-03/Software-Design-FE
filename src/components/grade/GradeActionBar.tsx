import React from "react";
import { SaveButton } from "@/components/grade/SaveButton";

interface GradeActionBarProps {
  onAddEval: () => void;
  onSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function GradeActionBar({ onAddEval, onSave }: GradeActionBarProps) {
  return (
    <div className="flex justify-end mt-16 gap-2">
      <button
        className="w-[84px] h-[32px] rounded-[6px] mb-[14px] bg-green-500 text-white hover:bg-green-600 transition"
        onClick={onAddEval}
        type="button"
      >
        + 평가방식
      </button>
      <SaveButton onClick={onSave} />
    </div>
  );
}
