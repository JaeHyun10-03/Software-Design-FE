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

  const {
    grade,
    classNumber,
    studentNumber,
    setGrade,
    setClassNumber,
    setStudentNumber,
    setStudentId,
  } = useStudentFilterStore();

  // 학년, 반, 번호가 바뀔 때마다 해당 학생 ID를 가져오기 위한 useEffect
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    const fetchStudentList = async () => {
      if (!grade || !classNumber || !studentNumber) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data.response;
        console.log(data)

        // 선택된 학년, 반, 번호에 맞는 학생을 찾기
        const matchedStudent = data.students.find(
          (student: any) =>
            student.number === Number(studentNumber)
        );

        if (matchedStudent) {
          setStudentId(matchedStudent.studentId);
        } else {
          console.warn("해당 학생을 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("학생 정보 가져오기 실패:", error);
      }
    };

    fetchStudentList();
  }, [grade, classNumber, studentNumber]);

  const handleGradeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(event.target.value);
  }, []);

  const handleClassChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setClassNumber(event.target.value);
  }, []);

  const handleNumberChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setStudentNumber(event.target.value);
  }, []);

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1">
        <select
          className="w-10 h-6 border border-gray-400 text-gray-800 text-center text-base rounded"
          value={value}
          onChange={onChange}
        >
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
