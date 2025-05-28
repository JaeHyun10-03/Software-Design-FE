// hooks/useGradeHandlers.ts
import { useState } from "react";
import { PostScore } from "@/api/postScore";
import { PostEval } from "@/api/postEval";
import { convertToApiFormat, Evaluation } from "@/utils/gradeUtils";

export function useGradeHandlers(
  students: any[],
  evaluations: Evaluation[],
  classNumber: string,
  evalInput: any,
  setEvaluations: (v: any) => void,
  setShowEvalInput: (v: boolean) => void,
  setEvalInput: (v: any) => void
) {
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

  const handleAddEval = async (subject: string, year: string, semester: string, grade: string) => {
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
        evalInput.examType,
        evalInput.title,
        Number(evalInput.weight),
        Number(evalInput.fullScore)
      );
      setEvaluations((prev: any) => [
        ...prev,
        {
          evaluationId: Date.now(),
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

  return { handleSave, handleAddEval };
}
