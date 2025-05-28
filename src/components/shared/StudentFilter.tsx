import React, { useMemo, useCallback, useEffect } from "react";
import useStudentFilterStore from "@/store/student-filter-store";
import useSelectedDate from "@/store/selected-date-store";
import axios from "axios";

interface SelectInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
}

export default function StudentFilter(): React.ReactElement {
  const gradeOptions = useMemo(() => ["1", "2", "3"], []);
  const classOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => (i + 1).toString()), []);
  const numberOptions = useMemo(() => Array.from({ length: 30 }, (_, i) => (i + 1).toString()), []);

  const { year } = useSelectedDate();

  const { grade, classNumber, studentNumber, setGrade, setClassNumber, setStudentNumber, setStudentId, setStudents } = useStudentFilterStore();

  // 🔁 grade/classNumber 바뀌면 학생 목록 갱신
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchStudentList = async () => {
      if (!grade || !classNumber || !studentNumber) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/teachers/students?year=${year}&grade=${grade}&classNum=${classNumber}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = res.data.response;
        const students = data.students || [];

        if (students.length > 0) {
          setStudentNumber(students[0].number.toString());
          setStudentId(students[0].studentId);
        }

        setStudents(students);
      } catch (error) {
        // alert("학생 목록을 불러오는 데 실패했습니다.");
        console.error(error);
      }
    };

    fetchStudentList();
  }, [grade, classNumber]);

  const handleGradeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(e.target.value);
  }, []);

  const handleClassChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassNumber(e.target.value);
  }, []);

  const handleNumberChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNumber = e.target.value;
    setStudentNumber(selectedNumber);

    // 현재 students에서 해당 학생 ID 찾기
    const student = useStudentFilterStore.getState().students.find((s) => s.number.toString() === selectedNumber);
    if (student) {
      setStudentId(student.studentId);
    }
  }, []);

  const SelectInput = useCallback(
    ({ value, onChange, options, label }: SelectInputProps) => (
      <div className="flex items-center gap-1">
        <select className="w-16 h-6 border border-gray-400 text-gray-800 text-center text-base rounded" value={value} onChange={onChange}>
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
