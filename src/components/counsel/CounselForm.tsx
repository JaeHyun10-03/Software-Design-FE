import React from "react";
import { ConsultingData, TeacherInfo } from "@/types/counsel";
import { COUNSEL_TYPES, categoryMap } from "@/utils/categoryMap";

interface CounselFormProps {
  form: Omit<ConsultingData, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<ConsultingData, "id">>>;
  teacher: TeacherInfo | null;
  sendAsPrivate: boolean;
  setSendAsPrivate: (v: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleAdd: (e: React.FormEvent) => void;
  handleEdit: (e: React.FormEvent) => void;
  selectedCounselId: number | null;
  selectedDate: string;
}

export function CounselForm({
  form,
  setForm,
  teacher,
  sendAsPrivate,
  setSendAsPrivate,
  handleChange,
  handleAdd,
  handleEdit,
  selectedCounselId,
  selectedDate,
}: CounselFormProps) {
  return (
    <form onSubmit={selectedCounselId ? handleEdit : handleAdd} className={form.isPublic ? "" : "blur-sm"} data-testid="counsel-form">
      <table className="w-full mb-4">
        <tbody>
          <tr>
            <th className="text-left w-28 font-medium py-2">상담 날짜</th>
            <td className="py-2">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "날짜를 선택하세요"}
            </td>
            <th className="text-left w-28 font-medium py-2">담당 교사</th>
            <td className="py-2">
              <span className="font-semibold text-gray-700">{teacher?.name}</span>
            </td>
          </tr>
          <tr>
            <th className="text-left font-medium py-2">상담 종류</th>
            <td colSpan={3} className="py-2">
              <select
                name="category"
                className="border rounded p-1"
                value={form.category}
                onChange={handleChange}
                required
                aria-label="상담 종류"
              >
                <option value="">선택</option>
                {COUNSEL_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {categoryMap[t] ?? t}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <th className="text-left font-medium py-2">상담 내용</th>
            <td colSpan={3} className="py-2">
              <textarea
                className="w-full h-24 p-2 border rounded"
                value={form.content || ""}
                onChange={handleChange}
                name="content"
                placeholder="상담 내용을 입력하세요"
                required
                aria-label="상담 내용"
              />
            </td>
          </tr>
          <tr>
            <th className="text-left font-medium py-2">다음 상담 일정</th>
            <td colSpan={3} className="py-2">
              <textarea
                className="w-full h-24 p-2 border rounded"
                value={form.nextPlan || ""}
                onChange={handleChange}
                name="nextPlan"
                placeholder="다음 상담 일정을 입력하세요"
                required
                aria-label="다음 상담 일정"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="py-2 text-right">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="sendAsPrivate"
                  checked={sendAsPrivate}
                  onChange={e => setSendAsPrivate(e.target.checked)}
                  className="form-checkbox w-5 h-5 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">비공개</span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end gap-2">
        {selectedCounselId && (
          <button
            type="button"
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            onClick={() => {
              setForm({
                dateTime: selectedDate,
                category: "",
                teacher: teacher?.name || "",
                content: "",
                isPublic: true,
                nextPlan: ""
              });
            }}
          >
            새 상담 추가
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {selectedCounselId ? "상담 수정" : "상담 등록"}
        </button>
      </div>
    </form>
  );
}
