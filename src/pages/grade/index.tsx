import React, { ReactNode, useState, useEffect } from "react";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import GradeFilter from "@/components/grade/GradeFilter";
import useStudentFilterStore from "@/store/student-filter-store";
import useGradeFilterStore from "@/store/grade-filter-store";

import { GetScore } from "@/api/getScoreSummary";
import { PostScore } from "@/api/postScore";
// 유틸 함수: classNames 결합용
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// 커스텀 Button 컴포넌트
const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return <button className={cn(" w-[84px] h-[32px] bg-[#0064FF] rounded-[6px] text-white mb-[14px]", className)} {...props} />;
};

export default function GradesPage() {
  const initialStudents: any[] = [];

  const { grade, classNumber, studentNumber } = useStudentFilterStore();
  const { year, semester, subject } = useGradeFilterStore();
  const [students, setStudents] = useState(initialStudents);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [editing, setEditing] = useState<{ row: number; key: string } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [evaluationTitles, setEvaluationTitles] = useState<string[]>([]);

  // 모든 값이 채워졌는지 체크
  const allFilled = [year, semester, subject, grade, classNumber, studentNumber].every(Boolean);

  // 값이 모두 채워지면 API 호출
  useEffect(() => {
    if (!allFilled) return;
    const fetchGrades = async () => {
      try {
        const response = await GetScore(Number(year), Number(semester), Number(grade), Number(classNumber), subject);
        const { titles, students } = mapApiResponseToStudents(response);
        console.log("매핑 결과:", titles, students);
        setEvaluationTitles(titles);
        setStudents(students);
      } catch (error) {
        console.error("Failed to fetch grades", error);
      }
    };
    fetchGrades();
  }, [year, semester, subject, grade, classNumber, studentNumber, allFilled]);

  const mapApiResponseToStudents = (response: any) => {
    if (!response?.evaluations) return { titles: [], students: [] };

    // 1. 기본 타이틀 + API 응답 타이틀 병합
    const apiTitles = response.evaluations.map((e: any) => e.title);
    const titles = [...new Set([...apiTitles])]; // 중복 제거

    // 2. 모든 학생 번호 수집
    const allNumbers: number[] = [];
    response.evaluations.forEach((e: any) => {
      e.scores?.forEach((s: any) => {
        if (!allNumbers.includes(s.number)) {
          allNumbers.push(s.number);
        }
      });
    });

    // 3. 학생 객체 초기화 (기본 타이틀 포함)
    const studentsMap: Record<number, any> = {};
    allNumbers.forEach((number) => {
      studentsMap[number] = {
        number,
        studentName: "",
        ...Object.fromEntries(titles.map((title) => [title, "-"])), // 기본 타이틀 포함
      };
    });

    // 4. 실제 데이터 매핑 (기존 코드 유지)
    response.evaluations.forEach((evaluation: any) => {
      evaluation.scores?.forEach((score: any) => {
        const student = studentsMap[score.number];
        if (student) {
          student.studentName = score.studentName;
          student[evaluation.title] = score.rawScore ?? "-";
        }
      });
    });

    return { titles, students: Object.values(studentsMap) };
  };

  const handleCellClick = (row: number, key: string, value: number | undefined) => {
    setEditing({ row, key });
    setInputValue(value !== undefined ? String(value) : "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    if (!editing) return;
    setStudents((prev) => prev.map((stu) => (stu.number === editing.row ? { ...stu, [editing.key]: inputValue === "" ? undefined : Number(inputValue) } : stu)));
    setEditing(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleInputBlur();
  };

  function convertToApiFormat(students: any[], evaluationTitles: string[], classNum: number) {
    // evaluationId는 evaluationTitles의 인덱스
    return evaluationTitles.map((title, idx) => ({
      classNum,
      evaluationId: idx,
      students: students.map((student) => ({
        number: student.number,
        rawScore: student[title] === "-" || student[title] === undefined || student[title] === null ? 0 : Number(student[title]),
      })),
    }));
  }

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    const payload = convertToApiFormat(students, evaluationTitles, Number(classNumber));
    console.log("저장할 데이터:", payload);

    try {
      const response = await PostScore(payload);
      console.log(`전송 결과: ${response}`);
    } catch (error) {
      console.error("저장 실패", error);
      alert(error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <StudentFilter />
        <GradeFilter />
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={handleSave}>저장</Button>
      </div>

      {allFilled ? (
        <>
          <p
            className=" font-nanum-gothic font-semibold text-[20px] leading-[23px]
    flex items-center
    text-black mb-[5px]"
          >
            {subject}
          </p>

          <div className="overflow-x-auto border-[#A9A9A9] ">
            <table className="min-w-full text-sm text-center ">
              <thead className="">
                <tr>
                  {["번호", "성명", ...evaluationTitles, "총점", "환산", "평균", "표준편차", "석차", "등급", "피드백(비고)"].map((header) => (
                    <th key={header} className="px-2 py-2 border">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.number} onClick={() => setSelectedRow(student.number)} className={cn("hover:bg-blue-100", selectedRow === student.number && "bg-blue-200")}>
                    <td className="border px-2 py-1">{student.number}</td>
                    <td className="border px-2 py-1">{student.studentName}</td>
                    {evaluationTitles.map((title) => (
                      <td key={title} className="border px-2 py-1 cursor-pointer" onClick={() => handleCellClick(student.number, title, student[title])}>
                        {editing && editing.row === student.number && editing.key === title ? (
                          <input
                            type="number"
                            className="w-16 border rounded px-1 py-0.5 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleInputKeyDown}
                            autoFocus
                          />
                        ) : (
                          student[title] ?? "-"
                        )}
                      </td>
                    ))}
                    {Array(7)
                      .fill(null)
                      .map((_, i) => (
                        <td key={i} className="border px-2 py-1">
                          -
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-gray-400 text-center mt-8">모든 정보를 입력해주세요.</div>
      )}
    </div>
  );
}

GradesPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
