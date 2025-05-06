import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import GradeFilter from "@/components/grade/GradeFilter";
import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
import { mapApiResponseToStudents, convertToApiFormat, Evaluation } from "@/utils/gradeUtils";
import { GradeTable } from "@/components/grade/GradeTable";
import { SaveButton } from "@/components/grade/SaveButton";
import useStudentFilterStore from "@/store/student-filter-store";
import useGradeFilterStore from "@/store/grade-filter-store";

export default function GradesPage() {
  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  const { year, semester, subject } = useGradeFilterStore();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ row: number; key: string } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const allFilled = [year, semester, subject, grade, classNumber, studentNumber].every(Boolean);

  useEffect(() => {
    if (!allFilled) return;
    const fetchGrades = async () => {
      try {
        const response = await GetScore(Number(year), Number(semester), Number(grade), Number(classNumber), subject);
        const { titles, students } = mapApiResponseToStudents(response);
        setEvaluations(titles);
        setStudents(students);
      } catch (error) {
        console.error("Failed to fetch grades", error);
      }
    };
    fetchGrades();
  }, [year, semester, subject, grade, classNumber, studentNumber, allFilled]);

  const handleCellClick = (row: number, key: string, value: number | undefined) => {
    setEditing({ row, key });
    setInputValue(value !== undefined ? String(value) : "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleInputBlur = () => {
    if (!editing) return;
    setStudents(prev =>
      prev.map(stu =>
        stu.number === editing.row
          ? { ...stu, [editing.key]: inputValue === "" ? undefined : Number(inputValue) }
          : stu
      )
    );
    setEditing(null);
  };
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleInputBlur();
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const payload = convertToApiFormat(students, evaluations, Number(classNumber));
    try {
      await PostScore(payload);
      window.location.reload();
    } catch (error) {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <StudentFilter />
        <GradeFilter />
      </div>
      <div className="flex justify-end mt-4">
        <SaveButton onClick={handleSave} />
      </div>
      {allFilled ? (
        <>
          <p className="font-nanum-gothic font-semibold text-[20px] leading-[23px] flex items-center text-black mb-[5px]">{subject}</p>
          <GradeTable
            evaluations={evaluations}
            students={students}
            editing={editing}
            inputValue={inputValue}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            handleCellClick={handleCellClick}
            handleInputChange={handleInputChange}
            handleInputBlur={handleInputBlur}
            handleInputKeyDown={handleInputKeyDown}
          />
        </>
      ) : (
        <div className="text-gray-400 text-center mt-8">모든 정보를 입력해주세요.</div>
      )}
    </div>
  );
}

GradesPage.getLayout = (page: React.ReactNode) => <Header>{page}</Header>;
