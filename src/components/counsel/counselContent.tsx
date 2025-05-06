import React, { useState, useEffect } from "react";
import useStudentFilterStore from "@/store/student-filter-store";
import { GetCounsel } from "@/api/getCounsel";
import { PostCounsel } from "@/api/postCounsel";
import { PutCounsel } from "@/api/putCounsel";
import { GetTeacherInfo } from "@/api/getTeacherInfo";
import { ConsultingData, TeacherInfo } from "@/types/counsel";
import { COUNSEL_TYPES, categoryMap, reverseCategoryMap } from "@/utils/categoryMap";
import { CounselCalendar } from "@/components/counsel/CounselCalendar";
import { CounselForm } from "@/components/counsel/counselForm";
import { CounselHistoryList } from "@/components/counsel/counselHistoryList";

let nextId = 5;

export default function CounselContent() {
  const { grade, classNumber, studentNumber, studentId } = useStudentFilterStore();
  const allFilled = [grade, classNumber, studentNumber].every(Boolean);

  const [consultingData, setConsultingData] = useState<ConsultingData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedCounselId, setSelectedCounselId] = useState<number | null>(null);
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [sendAsPrivate, setSendAsPrivate] = useState(false);

  const [form, setForm] = useState<Omit<ConsultingData, "id">>({
    dateTime: "",
    category: "",
    teacher: teacher?.name || "",
    content: "",
    isPublic: true,
    nextPlan: ""
  });

  useEffect(() => {
    if (!allFilled) return;
    const fetchCounsel = async () => {
      try {
        const response = await GetCounsel(studentId);
        setConsultingData(response);
      } catch (error) {
        console.error("Failed to fetch Counsel", error);
      }
    };
    fetchCounsel();
  }, [grade, classNumber, studentNumber, studentId, allFilled]);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await GetTeacherInfo();
        setTeacher(response);
      } catch {
        console.error("선생님 정보를 불러오는 데 실패했습니다.");
      }
    };
    fetchTeacherInfo();
  }, []);

  useEffect(() => {
    if (teacher?.name) {
      setForm(prev => ({ ...prev, teacher: teacher.name }));
    }
  }, [teacher?.name]);

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setSelectedCounselId(null);
    setForm({
      dateTime: arg.dateStr,
      category: "",
      teacher: teacher?.name || "",
      content: "",
      isPublic: true,
      nextPlan: ""
    });
  };

  const handleEventClick = (arg: any) => {
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

  const handleAdd = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setConsultingData((prev) => [...prev, { ...form, id: nextId++ }]);
    try {
      await PostCounsel(
        studentId,
        reverseCategoryMap[form.category] ?? form.category,
        form.content,
        form.nextPlan,
        form.dateTime,
        !sendAsPrivate
      );
    } catch (error) {
      console.error(" 실패", error);
      alert(error);
    }
    setForm({
      dateTime: selectedDate,
      category: "",
      teacher: teacher?.name || "",
      content: "",
      isPublic: true,
      nextPlan: ""
    });
  };

  const handleEdit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (selectedCounselId === null) return;
    setConsultingData((prev) =>
      prev.map((c) =>
        c.id === selectedCounselId ? { ...c, ...form } : c
      )
    );
    try {
      await PutCounsel(
        selectedCounselId,
        reverseCategoryMap[form.category] ?? form.category,
        form.content,
        form.nextPlan,
        form.dateTime,
        !sendAsPrivate
      );
    } catch (error) {
      console.error(" 실패", error);
      alert(error);
    }
  };

  // 캘린더 이벤트 데이터
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
  const events = consultingData.map((item) => ({
    id: String(item.id),
    title: categoryMap[item.category] ?? item.category,
    date: item.dateTime,
    backgroundColor: getEventColor(item.category),
    borderColor: "transparent",
  }));

  return (
    <div className="w-full h-full border border-[#a9a9a9] p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-w-[320px] flex justify-center items-center">
          <CounselCalendar
            events={events}
            selectedDate={selectedDate}
            handleDateClick={handleDateClick}
            handleEventClick={handleEventClick}
          />
        </div>
        <div className={`flex-[2] border rounded-md p-4 flex flex-col justify-between relative ${form.isPublic ? "" : "pointer-events-none"}`}>
          <CounselForm
            form={form}
            setForm={setForm}
            teacher={teacher}
            sendAsPrivate={sendAsPrivate}
            setSendAsPrivate={setSendAsPrivate}
            handleChange={handleChange}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            selectedCounselId={selectedCounselId}
            selectedDate={selectedDate}
          />
          {!form.isPublic && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
              <span className="text-lg text-gray-700 font-semibold">비공개 상담은 내용을 볼 수 없습니다.</span>
            </div>
          )}
        </div>
      </div>
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
        <CounselHistoryList
          dailyHistory={dailyHistory}
          selectedCounselId={selectedCounselId}
          setSelectedCounselId={setSelectedCounselId}
          setForm={setForm}
        />
      </div>
    </div>
  );
}
