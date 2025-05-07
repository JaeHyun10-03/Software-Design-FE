import React, { useMemo, useCallback, useEffect } from "react";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";

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

  const setStudentFilter = useStudentFilterStore.setState;
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const getStudentList = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data.response;
        // ✅ 상태를 한 번에 업데이트
        setStudentFilter({
          grade: data.grade,
          classNumber: data.classNum,
          studentNumber: data.students[0]?.number?.toString() ?? "1",
          studentId: data.students[0]?.studentId ?? "1",
          isReady: true,
        });
      } catch (error) {
        alert(`존재하지 않는 데이터입니다:${error}`);
        console.error("학생 목록 가져오기 오류:", error);
      }
    };
    getStudentList();
  }, []);

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
        <p className="w-8 text-base text-gray-800">{label}</p>
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
