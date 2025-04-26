import React, { useCallback, useMemo, useState } from "react";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

const DateFilter = () => {
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("4");

  const yearOptions = useMemo(() => ["2023", "2024", "2025"], []);
  const monthOptions = useMemo(() => ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"], []);

  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  }, []);

  const handleMonthChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  }, []);

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
    <div className="flex items-center gap-3">
      <SelectInput value={year} onChange={handleYearChange} options={yearOptions} label="년" />
      <SelectInput value={month} onChange={handleMonthChange} options={monthOptions} label="월" />
    </div>
  );
};

export default DateFilter;
