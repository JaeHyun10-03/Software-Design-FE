import React, { useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import { GradeHeaderSection } from "@/components/grade/GradeHeaderSection";
import { GradeActionBar } from "@/components/grade/GradeActionBar";
import { EvalAddModal } from "@/components/grade/EvalAddModal";
import { GradeTableSection } from "@/components/grade/GradeTableSection";
import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
import { PostEval } from "@/api/postEval";
import { GetEvalMethod } from "@/api/getEvalMethod";
import { GetStudentList } from "@/api/getStudentList";
import { mapApiResponseToStudents, convertToApiFormat, Evaluation } from "@/utils/gradeUtils";
import useStudentFilterStore from "@/store/student-filter-store";
import useGradeFilterStore from "@/store/grade-filter-store";
import useTeacher from "@/store/teacher-store";

export default function GradesPage() {
  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  const { year, semester, subject } = useGradeFilterStore();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ row: number; key: string } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [showEvalInput, setShowEvalInput] = useState(false);
  const mysubject = useTeacher().mysubject;
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
        const response = await GetScore(Number(year), Number(semester), Number(grade), Number(classNumber), subject);
        const { titles, students } = mapApiResponseToStudents(response);
        setEvaluations(titles);
        setStudents(students);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          try {
            const evalList = await GetEvalMethod(Number(year), Number(semester), Number(grade), subject);
            setEvaluations(evalList);
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
    setStudents((prev) => prev.map((stu) => (stu.number === editing.row ? { ...stu, [editing.key]: inputValue === "" ? undefined : Number(inputValue) } : stu)));
    setEditing(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleInputBlur();
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (subject != mysubject) {
      alert(`본인의 과목인 ${mysubject}만 수정가능합니다.`);
    } else {
      const payload = convertToApiFormat(students, evaluations, Number(classNumber));
      try {
        await PostScore(payload);
        window.location.reload();
      } catch {
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleAddEval = async () => {
    if (!evalInput.title.trim()) {
      alert("평가명을 입력하세요.");
      return;
    }
    try {
      await PostEval(subject, Number(year), Number(semester), Number(grade), evalInput.examType, evalInput.title, Number(evalInput.weight), Number(evalInput.fullScore));
      setEvaluations((prev) => [
        ...prev,
        {
          evaluationId: Date.now(),
          title: evalInput.title,
          examType: evalInput.examType,
          weight: evalInput.weight,
          fullScore: evalInput.fullScore,
        },
      ]);
      setShowEvalInput(false);
      setEvalInput({ title: "", examType: "WRITTEN", weight: 20, fullScore: 100 });
    } catch {
      alert("평가방식 추가에 실패했습니다.");
    }
  };

  return (
    <div className="mx-4 sm:mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <GradeHeaderSection />
      <GradeActionBar onAddEval={() => setShowEvalInput(true)} onSave={handleSave} />
      <EvalAddModal
        open={showEvalInput}
        value={evalInput}
        onChange={(v) => setEvalInput((prev) => ({ ...prev, ...v }))}
        onAdd={handleAddEval}
        onCancel={() => setShowEvalInput(false)}
      />
      <GradeTableSection
        allFilled={allFilled}
        subject={subject}
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
    </div>
  );
}

GradesPage.getLayout = (page: React.ReactNode) => <Header>{page}</Header>;
