import React, { useMemo, useCallback, useState, useEffect } from "react";
import useGradeFilterStore from "@/store/grade-filter-store";
import { PostSubject } from "@/api/postSubject";
import { GetSubjects } from "@/api/getSubjects"; // GetSubjects import

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

  // 과목 목록 불러오기 (year, semester, grade가 바뀔 때마다)
  useEffect(() => {
    async function fetchSubjects() {
      if (!year || !semester || !grade) {
        setSubjectOptions([]);
        return;
      }
      try {
        const data = await GetSubjects(Number(year), Number(semester), Number(grade));
        // data: [{id: 1, name: "독서와 문법"}, ...]
        const names = data.map((item: { name: any; }) => item.name);
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

  // PostSubject 사용!
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
    <div className="flex items-center gap-3">
      <SelectInput value={year} onChange={handleGradeChange} options={yearOptions} label="연도" />
      <SelectInput value={semester} onChange={handleClassChange} options={classOptions} label="학기" />
      {isAdding ? (
        <div className="flex items-center gap-1">
          <input
            className="border border-gray-400 rounded px-2 py-1 text-base"
            value={newSubject}
            onChange={e => setNewSubject(e.target.value)}
            placeholder="새 과목명 입력"
            onKeyDown={e => {
              if (e.key === "Enter") handleAddSubject();
              if (e.key === "Escape") setIsAdding(false);
            }}
            autoFocus
          />
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded"
            onClick={handleAddSubject}
            type="button"
          >
            추가
          </button>
          <button
            className="px-2 py-1 bg-gray-300 text-black rounded"
            onClick={() => setIsAdding(false)}
            type="button"
          >
            취소
          </button>
        </div>
      ) : (
        <SelectInput value={subject} onChange={handleNumberChange} options={subjectOptions} label="과목" />
      )}
    </div>
  );
}
