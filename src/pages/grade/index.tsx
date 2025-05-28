import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import GradeFilter from "@/components/grade/GradeFilter";
import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
import { PostEval } from "@/api/postEval";
import { GetEvalMethod } from "@/api/getEvalMethod"; // 추가
import { GetStudentList } from "@/api/getStudentList"; // 추가
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
  const [evalInput, setEvalInput] = useState({
    title: "",
    examType: "WRITTEN",
    weight: 20,
    fullScore: 100,
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
            // [{ evaluationId, title, examType, weight, fullScore }]
            setEvaluations(evalList);

            // 학생 목록 가져오기
            const studentList = await GetStudentList(Number(year), Number(grade), Number(classNumber));
            // [{ studentId, name, ... }]
            // 평가방식 개수만큼 "-"로 채운 점수 row 생성
            const studentsWithDash = studentList.map((stu: any) => {
              const row: any = {
                number: stu.studentId ?? "-",
                name: stu.name ?? "-",
              };
              evalList.forEach((ev: any) => {
                row[ev.title] = "-";
              });
              return row;
            });
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
      // 성공 시 평가방식 목록에 반영
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
      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2 h-auto sm:h-8">
        <StudentFilter />
        <GradeFilter />
      </div>
      <div className="flex justify-end mt-4 gap-2">
        {/* + 평가방식 버튼 */}
        <button
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          onClick={() => setShowEvalInput(v => !v)}
          type="button"
        >
          + 평가방식
        </button>
        <SaveButton onClick={handleSave} />
      </div>
      {/* 평가방식 추가 입력창 */}
      {showEvalInput && (
        <div className="border p-4 rounded bg-gray-50 mb-4 max-w-md self-end w-full sm:w-auto">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <input
                className="border rounded px-2 py-1"
                placeholder="평가명 (예: 중간고사)"
                value={evalInput.title}
                onChange={e => setEvalInput(v => ({ ...v, title: e.target.value }))}
              />
              <select
                className="border rounded px-2 py-1"
                value={evalInput.examType}
                onChange={e => setEvalInput(v => ({ ...v, examType: e.target.value as "WRITTEN" | "PRACTICAL" }))}
              >
                <option value="WRITTEN">지필</option>
                <option value="PRACTICAL">실기</option>
              </select>
              <input
                className="border rounded px-2 py-1 w-16"
                type="number"
                min={0}
                max={100}
                placeholder="배점"
                value={evalInput.weight}
                onChange={e => setEvalInput(v => ({ ...v, weight: Number(e.target.value) }))}
              />
              <input
                className="border rounded px-2 py-1 w-16"
                type="number"
                min={0}
                max={100}
                placeholder="만점"
                value={evalInput.fullScore}
                onChange={e => setEvalInput(v => ({ ...v, fullScore: Number(e.target.value) }))}
              />
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={handleAddEval}
                type="button"
              >
                추가
              </button>
              <button
                className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                onClick={() => setShowEvalInput(false)}
                type="button"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
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
