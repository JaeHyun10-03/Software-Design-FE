import React from "react";
import { Evaluation } from "@/utils/gradeUtils";

interface GradeTableProps {
  evaluations: Evaluation[];
  students: any[];
  editing: { row: number; key: string } | null;
  inputValue: string;
  selectedRow: number | null;
  setSelectedRow: (n: number) => void;
  handleCellClick: (row: number, key: string, value: number | undefined) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function GradeTable({
  evaluations,
  students,
  editing,
  inputValue,
  selectedRow,
  setSelectedRow,
  handleCellClick,
  handleInputChange,
  handleInputBlur,
  handleInputKeyDown,
}: GradeTableProps) {
  return (
    <div className="overflow-x-auto border-[#A9A9A9] ">
      <table className="min-w-full text-sm text-center ">
        <thead>
          <tr>
            {[
              "번호", "성명", ...evaluations.map(e => e.title),
              "총점", "환산", "평균", "표준편차", "석차", "등급", "성취도", 
            ].map((header) => (
              <th key={header} className="px-2 py-2 border">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <GradeTableRow
              key={student.number ?? student.studentId ?? student.name} // 항상 고유한 key
              student={student}
              evaluations={evaluations}
              editing={editing}
              inputValue={inputValue}
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              handleCellClick={handleCellClick}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              handleInputKeyDown={handleInputKeyDown}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradeTableRow({
  student,
  evaluations,
  editing,
  inputValue,
  selectedRow,
  setSelectedRow,
  handleCellClick,
  handleInputChange,
  handleInputBlur,
  handleInputKeyDown,
}: any) {
  return (
    <tr
      onClick={() => setSelectedRow(student.number)}
      className={`hover:bg-blue-100 ${selectedRow === student.number ? "bg-blue-200" : ""}`}
    >
      <td className="border px-2 py-1">{student.number}</td>
      <td className="border px-2 py-1">{student.studentName ?? student.name ?? "-"}</td>
      {evaluations.map((evaluation: any) => (
        <EditableCell
          key={evaluation.evaluationId ?? evaluation.title} // key가 항상 존재하도록
          student={student}
          evaluation={evaluation}
          editing={editing}
          inputValue={inputValue}
          handleCellClick={handleCellClick}
          handleInputChange={handleInputChange}
          handleInputBlur={handleInputBlur}
          handleInputKeyDown={handleInputKeyDown}
        />
      ))}
      <td className="border px-2 py-1">{typeof student.rawTotal === "number" ? student.rawTotal.toFixed(1) : "-"}</td>
      <td className="border px-2 py-1">{typeof student.weightedTotal === "number" ? student.weightedTotal.toFixed(1) :  "-"}</td>
      <td className="border px-2 py-1">{typeof student.average === "number" ? student.average.toFixed(2) : "-"}</td>
      <td className="border px-2 py-1">{typeof student.stdDev === "number" ? student.stdDev.toFixed(1): "-"}</td>
      <td className="border px-2 py-1">{student.rank ?? "-"}</td>
      <td className="border px-2 py-1">{student.grade ?? "-"}</td>
      <td className="border px-2 py-1">{student.achievementLevel ?? "-"}</td>
    </tr>
  );
}

function EditableCell({
  student,
  evaluation,
  editing,
  inputValue,
  handleCellClick,
  handleInputChange,
  handleInputBlur,
  handleInputKeyDown,
}: any) {
  const isEditing = editing && editing.row === student.number && editing.key === evaluation.title;
  return (
    <td
      className="border px-2 py-1 cursor-pointer"
      onClick={() => handleCellClick(student.number, evaluation.title, student[evaluation.title])}
    >
      {isEditing ? (
        <input
          type="number"
          className="w-8 border-none rounded px-1 py-0.5 no-spinner "
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          autoFocus
        />
      ) : (
        student[evaluation.title] ?? "-"
      )}
    </td>
  );
}
