import React, { useMemo, useCallback } from "react";
import useStudentFilterStore from "@/store/student-filter-store";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

export default function StudentFilter(): React.ReactElement {
  const gradeOptions: string[] = useMemo(() => ["1", "2", "3"], []);
  const classOptions: string[] = useMemo(() => Array.from({ length: 10 }, (_, i) => (i + 1).toString()), []);
  const numberOptions: string[] = useMemo(() => Array.from({ length: 30 }, (_, i) => (i + 1).toString()), []);

  const { grade, classNumber, studentNumber, setGrade, setClassNumber, setStudentNumber } = useStudentFilterStore();

  const handleGradeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setGrade(event.target.value), []);
  const handleClassChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setClassNumber(event.target.value), []);
  const handleNumberChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setStudentNumber(event.target.value), []);

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1">
        <select className="w-10 h-6 border border-gray-400 text-gray-800 text-center text-base rounded" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="w-7 text-base text-gray-800">{label}</p>
      </div>
    ),
    []
  );

  return (
    <div className="flex items-center gap-3">
      <SelectInput value={grade} onChange={handleGradeChange} options={gradeOptions} label="학년" />
      <SelectInput value={classNumber} onChange={handleClassChange} options={classOptions} label="반" />
      <SelectInput value={studentNumber} onChange={handleNumberChange} options={numberOptions} label="번" />
    </div>
  );
}
