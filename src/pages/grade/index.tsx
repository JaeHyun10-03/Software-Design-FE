import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import GradeFilter from "@/components/grade/GradeFilter";
import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
import { PostEval } from "@/api/postEval";
import { Modal } from "@/components/shared/Modal";
import { GetEvalMethod } from "@/api/getEvalMethod";
import { EvalAddForm } from "@/components/grade/EvalAddForm";
import { GetStudentList } from "@/api/getStudentList";
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
  const [showEvalInput, setShowEvalInput] = useState(false);
  const [evalInput, setEvalInput] = useState<{
    title: string;
    examType: "WRITTEN" | "PRACTICAL";
    weight: number | null;
    fullScore: number | null;
  }>({
    title: "",
    examType: "WRITTEN",
    weight: null,
    fullScore: null,
  });
  const allFilled = [year, semester, subject, grade, classNumber, studentNumber].every(Boolean);

  useEffect(() => {
    if (!allFilled) return;
    const fetchGrades = async () => {
      try {
        // 1. 먼저 GetScore로 시도
        const response = await GetScore(Number(year), Number(semester), Number(grade), Number(classNumber), subject);
        const { titles, students } = mapApiResponseToStudents(response);
        setEvaluations(titles);
        setStudents(students);
      } catch (error: any) {
        // 2. 404 에러(데이터 없음)일 때만 대체 로직 수행
        if (error?.response?.status === 404) {
          try {
            // 평가방식(컬럼) 목록 가져오기
            const evalList = await GetEvalMethod(Number(year), Number(semester), Number(grade), subject);
            setEvaluations(evalList);

            // 학생 목록 가져오기
            const studentList = await GetStudentList(Number(year), Number(grade), Number(classNumber));
            const studentsWithDash = Array.isArray(studentList)
              ? studentList.map((stu: any) => {
                  const row: any = {
                    number: stu.studentId ?? "-",
                    name: stu.name ?? "-",
                  };
                  evalList.forEach((ev: any) => {
                    row[ev.title] = "-";
                  });
                  return row;
                })
              : [];
            setStudents(studentsWithDash);
          } catch (fallbackError) {
            setEvaluations([]);
            setStudents([]);
            console.error("Fallback fetch failed", fallbackError);
          }
        } else {
          setEvaluations([]);
          setStudents([]);
          console.error("Failed to fetch grades", error);
        }
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
    } catch {
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 평가방식 추가 핸들러
  const handleAddEval = async () => {
    if (!evalInput.title.trim()) {
      alert("평가명을 입력하세요.");
      return;
    }
    try {
      await PostEval(
        subject,
        Number(year),
        Number(semester),
        Number(grade),
        evalInput.examType as "WRITTEN" | "PRACTICAL",
        evalInput.title,
        Number(evalInput.weight),
        Number(evalInput.fullScore)
      );
      setEvaluations(prev => [
        ...prev,
        {
          evaluationId: Date.now(), // 임시 id
          title: evalInput.title,
          examType: evalInput.examType,
          weight: evalInput.weight,
          fullScore: evalInput.fullScore,
        }
      ]);
      setShowEvalInput(false);
      setEvalInput({ title: "", examType: "WRITTEN", weight: 20, fullScore: 100 });
    } catch {
      alert("평가방식 추가에 실패했습니다.");
    }
  };

  return (
    <div className="mx-0 sm:mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-base w-full gap-2 sm:h-8">
        <div className="flex mb-[20px]"><StudentFilter /></div>
        <div className="flex mt-[-16px] max-h-[24px]"><GradeFilter /></div>
      </div>
   
      <div className="flex justify-end mt-16 gap-2">
        {/* + 평가방식 버튼 */}
        <button
          className="w-[84px] h-[32px] rounded-[6px] mb-[14px] bg-green-500 text-white  hover:bg-green-600 transition"
          onClick={() =>setShowEvalInput(true) }
          type="button"
        >
          + 평가방식
        </button>
        <SaveButton onClick={handleSave} />
      </div>
      {/* 평가방식 추가 모달 */}
        <Modal open={showEvalInput} onClose={() => setShowEvalInput(false)}>
        <EvalAddForm
          value={evalInput}
          onChange={v => setEvalInput(prev => ({ ...prev, ...v }))}
          onAdd={handleAddEval}
          onCancel={() => setShowEvalInput(false)}
        />
      </Modal>
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
