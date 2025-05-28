import AttendanceContent from "@/components/attendance/attendanceContent";
import DateFilter from "@/components/shared/DateFilter";
import AttendanceType from "@/components/shared/AttendanceType";
import Button from "@/components/shared/Button";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import React, { ReactNode, useState, useRef } from "react";

export default function AttendancePage() {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // MutableRefObject 형태로 사용하기 위해 useRef를 사용
  const saveAttendanceRef = useRef<(() => Promise<void>) | null>(null);

  // AttendanceContent 컴포넌트의 ref
  const contentRef = useRef<{ postAttendances: () => Promise<void> } | null>(null);

  // 저장 함수 설정
  const setSaveFunction = (saveFunction: () => Promise<void>) => {
    saveAttendanceRef.current = saveFunction;
  };

  // 저장 버튼 클릭 처리
  const handleSave = async () => {
    try {
      setLoading(true);

      // 저장 함수가 ref를 통해 설정된 경우
      if (saveAttendanceRef.current) {
        await saveAttendanceRef.current();
      }
      // 또는 컴포넌트 ref를 통해 직접 접근하는 경우
      else if (contentRef.current) {
        await contentRef.current.postAttendances();
      } else {
        console.error("저장 함수를 찾을 수 없습니다.");
      }

      setEdit(false);
    } catch (err) {
      console.error("저장 중 오류 발생:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:mx-8 mx-4 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col h-16 gap-4 sm:flex-row sm:h-8">
        <StudentFilter />
        <DateFilter></DateFilter>

        <div className="flex flex-row gap-4 ml-auto">
          <div className="hidden lg:flex">
            <AttendanceType />
          </div>
        </div>
      </div>
      <div className="flex flex-row mt-4 flex-1">
        <AttendanceContent ref={contentRef} edit={edit} onSave={setSaveFunction} />
      </div>
      {edit ? (
        <Button onClick={handleSave} className="w-20 h-8 mt-4 ml-auto" disabled={loading}>
          {loading ? "저장 중..." : "저장"}
        </Button>
      ) : (
        <Button
          onClick={() => {
            setEdit(true);
          }}
          className="w-20 h-8 mt-4 ml-auto"
        >
          수정
        </Button>
      )}
    </div>
  );
}

AttendancePage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
