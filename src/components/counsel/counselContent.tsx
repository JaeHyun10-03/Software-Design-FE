import React, { useState,  useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import useStudentFilterStore from "@/store/student-filter-store";
import { GetCounsel } from "@/api/getCounsel";
import { PostCounsel } from "@/api/postCounsel";
interface ConsultingData {
  id: number;
  dateTime: string; // YYYY-MM-DD
  category: string;
  teacher: string;
  content: string;
  nextPlan: string;
  isPublic: boolean;
}

const COUNSEL_TYPES = ["대학", "취업", "가정", "학업", "개인", "기타"];
const TEACHERS = ["박기석", "김교사", "이교사", "정교사"];
let nextId = 5;



export default function CounselContent() {
  const { grade, classNumber, studentNumber, studentId, } = useStudentFilterStore();
  const allFilled = [grade, classNumber, studentNumber].every(Boolean);
  const [consultingData, setConsultingData] = useState<ConsultingData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCounselId, setSelectedCounselId] = useState<number | null>(null);

  const [form, setForm] = useState<Omit<ConsultingData, "id">>({
    dateTime: "",
    category: "",
    teacher: "",
    content: "",
    isPublic: true,
    nextPlan: ""
  });

  const categoryMap: Record<string, string> = {
    UNIVERSITY: "대학",
    CAREER: "취업",
    FAMILY: "가정",
    ACADEMIC: "학업",
    PERSONAL: "개인",
    OTHER: "기타",
  };

  
  useEffect(() => {
      if (!allFilled) return;
      const fetchCounsel = async () => {
        try {
          const response = await GetCounsel(
            studentId
            );
            setConsultingData([response]);
          } catch (error) {
          console.error("Failed to fetch Counsel", error);
        }
      };
      fetchCounsel();
    }, [ grade, classNumber, studentNumber,studentId,  allFilled]);
  

  
  // 날짜 클릭: 상담 추가 폼
  const handleDateClick = (arg: DateClickArg) => {
    setSelectedDate(arg.dateStr);
    setSelectedCounselId(null);
    setForm({ dateTime: arg.dateStr, category: "", teacher: "", content: "", isPublic: true, nextPlan: ""  });
  };

  // 상담 이력 클릭: 수정 폼
  const handleEventClick = (arg: EventClickArg) => {
    const id = Number(arg.event.id);
    const counsel = consultingData.find((c) => c.id === id);
    if (counsel) {
      setSelectedDate(counsel.dateTime);
      setSelectedCounselId(id);
      setForm({
        dateTime: counsel.dateTime,
        category: counsel.category,
        teacher: counsel.teacher,
        content: counsel.content,
        isPublic: counsel.isPublic,
        nextPlan: counsel.nextPlan
      });
    }
  };

  const dailyHistory = consultingData.filter((c) => c.dateTime === selectedDate);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.teacher || !form.content) return;
    setConsultingData((prev) => [...prev, { ...form, id: nextId++ }]);
    setForm({ dateTime: selectedDate, category: "", teacher: "", content: "" , isPublic: true, nextPlan: ""});
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


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
      e.preventDefault();
      if (!form.teacher || !form.content) {
          alert('정보를 모두 입력해주세요.');
          return;
      }
  
      try {
        
          const response = await PostCounsel(form.category, form.content, form.nextPlan, form.dateTime, form.isPublic, form.teacher);
          console.log(` 결과: ${response}`);    
          
         
      } catch (error) {
          console.error(" 실패", error);
          alert(error);
          //alert('이메일 혹은 비밀번호가 틀립니다. 다시 시도해주세요.');
      }
  };
  // 캘린더 이벤트
  const events = consultingData.map((item) => ({
    id: String(item.id),
    title: categoryMap[item.category] ?? item.category,
    date: item.dateTime,
    backgroundColor: getEventColor(item.category),
    borderColor: "transparent",
  }));


  

  function getEventColor(type: string): string {
    switch (type) {
      case "UNIVERSITY":
        return "#4285F4";
      case "CAREER":
        return "#34A853";
      case "FAMILY":
        return "#FBBC05";
      case "ACADEMIC":
        return "#EA4335";
      case "PERSONAL":
        return "#8F00FF";
      case "OTHER":
        return "#1677FF";
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
        <div className={`flex-[2] border rounded-md p-4 flex flex-col justify-between relative ${form.isPublic ? "" : "pointer-events-none"}`}>
          <form onSubmit={selectedCounselId ? handleEdit : handleAdd} className={form.isPublic ? "" : "blur-sm"}>
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
                      value={categoryMap[form.category] ?? form.category}
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
                <tr>
                  <th className="text-left font-medium py-2">다음 상담 일정</th>
                  <td colSpan={3} className="py-2">
                    <textarea
                      className="w-full h-24 p-2 border rounded"
                      value={form.nextPlan}
                      onChange={handleChange}
                      name="nextPlan"
                      placeholder="상담 내용을 입력하세요"
                      required
                    />
                  </td>
                </tr>
                {/* <tr>
                  <td colSpan={4} className="py-2 text-right">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={!form.isPublic}
                        onChange={e =>
                          handleChange({
                            target: {
                              name: "isPublic",
                              value: !e.target.checked, // 체크 시 false(비공개), 해제 시 true(공개)
                          },
                        } as any)
                      }
                      className="form-checkbox w-5 h-5 text-blue-600 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">비공개</span>
                    </label>
                  </td>
                </tr> */}
              </tbody>
            </table>
        
            <div className="flex justify-end gap-2">
              {selectedCounselId && (
                <button
                  type="button"
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
                  onClick={() => {
                    setSelectedCounselId(null);
                    setForm({ dateTime: selectedDate, category: "", teacher: "", content: "",  isPublic: true, nextPlan: ""});
                  }}
                >
                  새 상담 추가
                </button>
              )}
              <button
                type="submit"
                onClick={()=>handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                {selectedCounselId ? "상담 수정" : "상담 등록"}
              </button>
            </div> 
          </form>
          {!form.isPublic && (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
      <span className="text-lg text-gray-700 font-semibold">비공개 상담은 내용을 볼 수 없습니다.</span>
    </div>
  )}
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
        <div className="flex flex-col gap-2 relative">
  {dailyHistory.length > 0 ? (
    dailyHistory.map((item) => (
      <div
        key={item.id}
        className={`border rounded px-4 py-2 bg-gray-50 text-sm cursor-pointer relative ${
          selectedCounselId === item.id ? "border-blue-500 bg-blue-50" : ""
        }`}
      >
        {/* 블러 처리 영역 */}
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
          <div className="font-medium">
            {categoryMap[item.category] ?? item.category}
          </div>
          <div className="text-xs text-gray-500">
            담당 교사: {item.teacher}
          </div>
          <div className="text-xs text-gray-500">
            {item.content.length > 30
              ? item.content.slice(0, 30) + "..."
              : item.content}
          </div>
        </div>

        {/* 비공개 항목에만 보이는 버튼 */}
        {!item.isPublic && (
          <button
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-white/50 z-10 text-blue-600 hover:text-blue-800 text-xs"
            onClick={() => {
              // 여기에 내용 확인 로직 추가
              setSelectedCounselId(item.id);
              setForm({ ...item });
            }}
          >
            상담이 비공개입니다.
          </button>
        )}
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
