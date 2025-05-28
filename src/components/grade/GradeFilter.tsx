import React, { useMemo, useCallback, useState, useEffect } from "react";
import useGradeFilterStore from "@/store/grade-filter-store";
import { PostSubject } from "@/api/postSubject";
import { GetSubjects } from "@/api/getSubjects";
import { AddSubjectForm } from "@/components/grade/AddSubjectForm";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

export default function GradeFilter() {
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState("");

  const yearOptions = useMemo(() => ["2025", "2024", "2023", "2022"], []);
  const classOptions = useMemo(() => ["1", "2"], []);

  const { year, semester, grade, subject, setYear, setSemester, setSubject } = useGradeFilterStore();

  useEffect(() => {
    async function fetchSubjects() {
      if (!year || !semester || !grade) {
        setSubjectOptions([]);
        return;
      }
      try {
        const data = await GetSubjects(Number(year), Number(semester), Number(grade));
        const names = data.map((item: { name: any }) => item.name);
        setSubjectOptions([...names, "+ 과목추가"]);
      } catch (e) {
        setSubjectOptions(["+ 과목추가"]);
      }
    }
    fetchSubjects();
  }, [year, semester, grade]);

  const handleGradeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => setYear(event.target.value),
    [setYear]
  );
  const handleClassChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => setSemester(event.target.value),
    [setSemester]
  );

  const handleNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      if (value === "+ 과목추가") {
        setIsAdding(true);
        setNewSubject("");
      } else {
        setSubject(value);
      }
    },
    [setSubject]
  );

  const handleAddSubject = async () => {
    const trimmed = newSubject.trim();
    if (!trimmed) {
      alert("과목명을 입력하세요.");
      return;
    }
    try {
      await PostSubject(trimmed);
      setSubjectOptions((prev) => {
        const base = prev.filter(opt => opt !== "+ 과목추가");
        if (!base.includes(trimmed)) base.push(trimmed);
                alert("과목이 추가되었습니다. 과목의 평가방식을 꼭 추가해주세요");

        return [...base, "+ 과목추가"];
      });
      setSubject(trimmed);
      setIsAdding(false);
    } catch (e) {
      alert("과목 추가에 실패했습니다.");
    }
  };

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1">
        <select
          className="w-15 h-6 border border-gray-400 text-gray-800 text-center text-base rounded"
          value={value}
          onChange={onChange}
        >
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
    <div className=" flex-col items-center justify-center w-full h-auto sm:h-8 gap-2">
    <div className="flex flex-row sm:items-center gap-3">
      <div className="flex flex-row gap-3">
        <SelectInput value={year} onChange={handleGradeChange} options={yearOptions} label="연도" />
        <SelectInput value={semester} onChange={handleClassChange} options={classOptions} label="학기" />
        <SelectInput value={subject} onChange={handleNumberChange} options={subjectOptions} label="과목" />
      </div>
      
    </div>
    {isAdding && (
        <div className="flex mt-2">
          <AddSubjectForm
            value={newSubject}
            onChange={setNewSubject}
            onAdd={handleAddSubject}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}
    </div>
  );
}
