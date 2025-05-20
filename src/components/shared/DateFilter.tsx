import React, { useMemo, useCallback } from "react";
import useSelectedDate from "@/store/selected-date-store"; // zustand 훅 위치에 맞게 수정하세요

interface SelectInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: number[];
  label: string;
}

export default function DateFilter(): React.ReactElement {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth()는 0부터 시작하므로 +1 필요

  const yearOptions: number[] = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, [currentYear]);

  const monthOptions: number[] = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, []);

  const { year, month, semester, setYear, setMonth, setSemester } = useSelectedDate();

  // 초기 값이 없는 경우, 현재 연도와 월을 디폴트로 설정
  const handleYearChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setYear(Number(event.target.value));
    },
    [setYear]
  );

  const handleMonthChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setMonth(Number(event.target.value));
    },
    [setMonth]
  );

  const handleSemesterChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSemester(Number(event.target.value));
    },
    [setSemester]
  );

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1 w-21">
        <select className="w-20 h-6 border border-gray-400 text-gray-800 text-center text-base rounded" value={value} onChange={onChange}>
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
    <div className="flex items-center gap-3 ml-0 sm:ml-4">
      <SelectInput value={year || currentYear} onChange={handleYearChange} options={yearOptions} label="년" />
      <SelectInput value={month || currentMonth} onChange={handleMonthChange} options={monthOptions} label="월" />
      <SelectInput value={semester} onChange={handleSemesterChange} options={[1, 2]} label="학기" />
    </div>
  );
}
