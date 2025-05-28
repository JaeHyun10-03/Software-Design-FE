import React from "react";
import { GradeTable } from "@/components/grade/GradeTable";
import { Evaluation } from "@/utils/gradeUtils";

interface GradeTableSectionProps {
  allFilled: boolean;
  subject: string;
  evaluations: Evaluation[];
  students: any[];
  editing: any;
  inputValue: string;
  selectedRow: number | null;
  setSelectedRow: (n: number) => void;
  handleCellClick: (row: number, key: string, value: number | undefined) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function GradeTableSection(props: GradeTableSectionProps) {
  if (!props.allFilled) {
    return <div className="text-gray-400 text-center mt-8">모든 정보를 입력해주세요.</div>;
  }
  return (
    <>
      <p className="font-nanum-gothic font-semibold text-[20px] leading-[23px] flex items-center text-black mb-[5px]">{props.subject}</p>
      <GradeTable
        evaluations={props.evaluations}
        students={props.students}
        editing={props.editing}
        inputValue={props.inputValue}
        selectedRow={props.selectedRow}
        setSelectedRow={props.setSelectedRow}
        handleCellClick={props.handleCellClick}
        handleInputChange={props.handleInputChange}
        handleInputBlur={props.handleInputBlur}
        handleInputKeyDown={props.handleInputKeyDown}
      />
    </>
  );
}
