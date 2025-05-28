// components/grade/AddSubjectForm.tsx
import React from "react";

interface AddSubjectFormProps {
  value: string;
  onChange: (v: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function AddSubjectForm({ value, onChange, onAdd, onCancel }: AddSubjectFormProps) {
  return (
    <div className="flex items-center gap-1">
      <input
        className="border border-gray-400 rounded px-2 py-1 text-base"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="새 과목명 입력"
        onKeyDown={e => {
          if (e.key === "Enter") onAdd();
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
      />
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
        onClick={onAdd}
        type="button"
      >
        추가
      </button>
      <button
        className="px-2 py-1 bg-gray-300 text-black rounded text-sm"
        onClick={onCancel}
        type="button"
      >
        취소
      </button>
    </div>
  );
}
