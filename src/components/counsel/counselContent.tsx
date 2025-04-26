import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";

interface ConsultingData {
  id: number;
  date: string; // YYYY-MM-DD
  type: string;
  teacher: string;
  content: string;
}

const COUNSEL_TYPES = ["대학", "취업", "가정", "학업", "개인", "기타"];
const TEACHERS = ["박기석", "김교사", "이교사", "정교사"];
let nextId = 5;

const initialData: ConsultingData[] = [
    {
      id: 1,
      date: "2025-03-24",
      type: "대학",
      teacher: "김교사",
      content: "대학 진학 관련 상담",
    },
    {
      id: 2,
      date: "2025-04-05",
      type: "취업",
      teacher: "이교사",
      content: "취업 준비 관련 상담",
    },
    {
      id: 3,
      date: "2025-05-05",
      type: "학업",
      teacher: "박기석",
      content: "학업 성취도 향상을 위한 상담",
    },
    {
      id: 4,
      date: "2025-05-20",
      type: "개인",
      teacher: "정교사",
      content: "개인 고민 상담",
    },
  ];

export default function CounselContent() {
  const [consultingData, setConsultingData] = useState<ConsultingData[]>(initialData);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCounselId, setSelectedCounselId] = useState<number | null>(null);

  const [form, setForm] = useState<Omit<ConsultingData, "id">>({
    date: "",
    type: "",
    teacher: "",
    content: "",
  });

  // 날짜 클릭: 상담 추가 폼
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setSelectedCounselId(null);
    setForm({ date: arg.dateStr, type: "", teacher: "", content: "" });
  };

  // 상담 이력 클릭: 수정 폼
  const handleEventClick = (arg: EventClickArg) => {
    const id = Number(arg.event.id);
    const counsel = consultingData.find((c) => c.id === id);
    if (counsel) {
      setSelectedDate(counsel.date);
      setSelectedCounselId(id);
      setForm({
        date: counsel.date,
        type: counsel.type,
        teacher: counsel.teacher,
        content: counsel.content,
      });
    }
  };

  const dailyHistory = consultingData.filter((c) => c.date === selectedDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.teacher || !form.content) return;
    setConsultingData((prev) => [...prev, { ...form, id: nextId++ }]);
    setForm({ date: selectedDate, type: "", teacher: "", content: "" });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCounselId === null) return;
    setConsultingData((prev) =>
      prev.map((c) =>
        c.id === selectedCounselId ? { ...c, ...form } : c
      )
    );
  };

  // 캘린더 이벤트
  const events = consultingData.map((item) => ({
    id: String(item.id),
    title: item.type,
    date: item.date,
    backgroundColor: getEventColor(item.type),
    borderColor: "transparent",
  }));


  

  function getEventColor(type: string): string {
    switch (type) {
      case "대학":
        return "#4285F4";
      case "취업":
        return "#34A853";
      case "가정":
        return "#FBBC05";
      case "학업":
        return "#EA4335";
      case "개인":
        return "#8F00FF";
      default:
        return "#1677FF";
    }
  }
  
  return (
    <div className="w-full h-full border border-[#a9a9a9] p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* 캘린더 */}
        <div className="flex-1 min-w-[320px] flex justify-center items-center">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={koLocale}
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            dayCellContent={(arg) => {
              // 숫자만 표시
              const numberOnly = arg.dayNumberText.replace(/[^\d]/g, "");
              return <span>{numberOnly}</span>;
            }}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            events={events}
            height="auto"
            firstDay={0}
            dayCellClassNames={(arg) => {
                // arg.date는 Date 객체, selectedDate는 'YYYY-MM-DD' 문자열
                const y = arg.date.getFullYear();
                const m = String(arg.date.getMonth() + 1).padStart(2, "0");
                const d = String(arg.date.getDate()).padStart(2, "0");
                const cellDateStr = `${y}-${m}-${d}`;
                if (cellDateStr === selectedDate) {
                  return ["selected-date"];
                }
                return [];
              }}
            contentHeight={320}
          />
        </div>
        {/* 상담 폼 */}
        <div className="flex-[2] border rounded-md p-4 flex flex-col justify-between">
          <form onSubmit={selectedCounselId ? handleEdit : handleAdd}>
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
                    <select
                      name="teacher"
                      className="border rounded p-1"
                      value={form.teacher}
                      onChange={handleChange}
                      required
                    >
                      <option value="">선택</option>
                      {TEACHERS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th className="text-left font-medium py-2">상담 종류</th>
                  <td colSpan={3} className="py-2">
                    <select
                      name="type"
                      className="border rounded p-1"
                      value={form.type}
                      onChange={handleChange}
                      required
                    >
                      <option value="">선택</option>
                      {COUNSEL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
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
                      value={form.content}
                      onChange={handleChange}
                      name="content"
                      placeholder="상담 내용을 입력하세요"
                      required
                    />
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
                    setSelectedCounselId(null);
                    setForm({ date: selectedDate, type: "", teacher: "", content: "" });
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
        </div>
      </div>
      {/* 상담 이력 리스트 */}
      <div className="mt-8">
        <div className="font-semibold mb-2">
          {selectedDate
            ? `${new Date(selectedDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })} 상담 이력`
            : "상담이력"}
        </div>
        <div className="flex flex-col gap-2">
          {dailyHistory.length > 0 ? (
            dailyHistory.map((item) => (
              <div
                key={item.id}
                className={`border rounded px-4 py-2 bg-gray-50 text-sm cursor-pointer ${
                  selectedCounselId === item.id
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCounselId(item.id);
                  setForm({
                    date: item.date,
                    type: item.type,
                    teacher: item.teacher,
                    content: item.content,
                  });
                }}
              >
                <div className="font-medium">{item.type}</div>
                <div className="text-xs text-gray-500">
                  담당 교사: {item.teacher}
                </div>
                <div className="text-xs text-gray-500">
                  {item.content.length > 30
                    ? item.content.slice(0, 30) + "..."
                    : item.content}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">선택한 날짜의 상담 이력이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
}
