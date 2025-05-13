import React, { useMemo, useCallback } from "react";
import useSubjectFilterStore from "@/store/subject-filter-store";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

export default function SubjectFilter(): React.ReactElement {
  const yearOptions: string[] = useMemo(() => ["2025", "2024", "2023","2022","2021"], []);
  const semesterOptions: string[] = useMemo(() => Array.from({ length: 2 }, (_, i) => (i + 1).toString()), []);
  const subjectOptions: string[] = useMemo(() => ["국어", "영어", "사회","과학","수학"], []);

  const { year, semester, subject, setyear, setsemester, setsubject } = useSubjectFilterStore();

  const handleGradeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setyear(event.target.value), []);
  const handleClassChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setsemester(event.target.value), []);
  const handleNumberChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => setsubject(event.target.value), []);

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1">
        <select className="w-12 h-6 border border-gray-400 text-gray-800 text-center text-base rounded" value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="text-base text-gray-800">{label}</p>
      </div>
    ),
    []
  );

  return (
    <div className="ml-[12px] flex items-center gap-3">
      <SelectInput value={year} onChange={handleGradeChange} options={yearOptions} label="년도" />
      <SelectInput value={semester} onChange={handleClassChange} options={semesterOptions} label="학기" />
      <SelectInput value={subject} onChange={handleNumberChange} options={subjectOptions} label="과목" />
    </div>
  );
}
