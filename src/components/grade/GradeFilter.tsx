import React, { useMemo, useCallback } from "react";
import useGradeFilterStore from "@/store/grade-filter-store";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

export default function GradeFilter(): React.ReactElement { // 컴포넌트 이름 StudentFilter → GradeFilter로 수정
  const yearOptions: string[] = useMemo(() => ["2025", "2024", "2023","2022"], []);
  const classOptions: string[] = useMemo(() => ["1", "2"], []);
  const numberOptions: string[] = useMemo(() => ["독서와 문법", "영어1", "확률과 통계", "미적분2","물리1","화학1","도덕","정보"], []);

  // Zustand 스토어에서 set 함수 추출
  const { year, semester, subject, setYear, setSemester, setSubject } = useGradeFilterStore();

  // 의존성 배열에 set 함수 추가
  const handleGradeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => setYear(event.target.value),
    [setYear] // ✅
  );
  const handleClassChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => setSemester(event.target.value),
    [setSemester] // ✅
  );
  const handleNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => setSubject(event.target.value),
    [setSubject] // ✅
  );

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1">
        <select className="w-15 h-6 border border-gray-400 text-gray-800 text-center text-base rounded" 
                value={value} 
                onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="text-base text-gray-800">{label}</p>
      </div>
    ),
    [] // 내부에서 외부 상태 사용하지 않으므로 의존성 배열 유지
  );

  return (
    <div className="flex items-center gap-3 ml-3">
      <SelectInput value={year} onChange={handleGradeChange} options={yearOptions} label="연도" />
      <SelectInput value={semester} onChange={handleClassChange} options={classOptions} label="학기" />
      <SelectInput value={subject} onChange={handleNumberChange} options={numberOptions} label="과목" />
    </div>
  );
}
