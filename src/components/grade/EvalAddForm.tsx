import React from "react";

interface EvalAddFormProps {
  value: {
    title: string;
    examType: "WRITTEN" | "PRACTICAL";
    weight: number | null;
    fullScore: number | null;
  };
  onChange: (v: Partial<EvalAddFormProps["value"]>) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function EvalAddForm({ value, onChange, onAdd, onCancel }: EvalAddFormProps) {
  return (
    <div className="flex flex-col justify-start p-3 mb-4 self-end sm:self-start w-full sm:w-auto min-h-60">
      <div className="flex flex-col gap-2">
        <p className="flex self-start mb-5 text-[17px] font-semibold">평가방식 추가하기</p>
        <div className="flex flex-col items-start flex-wrap gap-2  eval-add-form-row ">
          <div className="flex flex-row items-center">
            <p className="mr-2">평가명: </p>
            <input
                className="border rounded px-2 py-1 max-w-[150px] h-[34px] text-sm"
                placeholder="(예: 중간고사)"
                value={value.title}
                onChange={e => onChange({ title: e.target.value })}
            />
          </div>
          <div className="flex items-center">
            <p className="mr-2">평가유형: </p>
              <select
                className="border rounded px-2 py-1"
                value={value.examType}
                onChange={e => onChange({ examType: e.target.value as "WRITTEN" | "PRACTICAL" })}
              >
                <option value="WRITTEN">지필</option>
                <option value="PRACTICAL">실기</option>
              </select>
          </div>

          <div className="flex items-center">
            <p className="mr-2">가중치: </p>
              <input
                className="border rounded px-2 py-1 w-12 h-[34px] no-spinner"
                type="number"
                min={0}
                max={100}
                placeholder="20"
                value={value.weight === null ? "" : value.weight}
                onChange={e => onChange({ weight: Number(e.target.value) })}
              />
          </div>
            {/* 만점 입력 필드 */}
          <div className="flex items-center">
            <p className="mr-2">만점: </p>
              <input
                className="border rounded px-2 py-1 w-12 no-spinner"
                type="number"
                min={0}
                max={100}
                placeholder="100"
                value={value.fullScore === null ? "" : value.fullScore}
                onChange={e => onChange({ fullScore: Number(e.target.value) })}
              />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex self-center gap-2 mt-3 eval-add-form-btns">
            <button
              className="text-sm h-[34px] bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={onAdd}
              type="button"
            >
              추가
            </button>
            <button
              className="text-sm bg-gray-300 h-[34px] text-black px-3 py-1 rounded hover:bg-gray-400"
              onClick={onCancel}
              type="button"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
