import React, { ReactNode, useState } from "react";
import { Header } from "@/components/shared/Header";

// 유틸 함수: classNames 결합용
function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// 커스텀 Input 컴포넌트
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn("border border-gray-300 px-2 py-1 flex items-center text-center", className)}
      {...props}
    />
  );
};

// 커스텀 Button 컴포넌트
const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(" w-[84px] h-[32px] bg-[#0064FF] rounded-[6px] text-white mb-[14px]", className)}
      {...props}
    />
  );
};

const initialStudents = [
  { 번호: 1, 성명: "김", 중간고사: 10, 기말고사: 10, 수행평가1: 10, 수행평가2: 10 },
  { 번호: 2, 성명: "김법", 중간고사: 20, 기말고사: 20, 수행평가1: 20 },
  { 번호: 3, 성명: "김법수", 중간고사: 30, 기말고사: 30, 수행평가1: 30 },
  // ... 생략된 나머지 데이터들
];

type ScoreKey = "중간고사" | "기말고사" | "수행평가1" | "수행평가2";

export default function GradesPage() {
  const [students, setStudents] = useState(initialStudents);
  // editing: {row: 번호, key: ScoreKey} | null
  const [editing, setEditing] = useState<{ row: number; key: ScoreKey } | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState("");
  const [classNum, setClassNum] = useState("");
  const [studentNum, setStudentNum] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const allFilled = grade && classNum &&  year && semester && subject;

  // 셀 클릭 시
  const handleCellClick = (row: number, key: ScoreKey, value: number | undefined) => {
    setEditing({ row, key });
    setInputValue(value !== undefined ? String(value) : "");
  };

  // 입력 변경
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 입력 완료(엔터/포커스아웃)
  const handleInputBlur = () => {
    if (!editing) return;
    setStudents((prev) =>
      prev.map((stu) =>
        stu.번호 === editing.row
          ? { ...stu, [editing.key]: inputValue === "" ? undefined : Number(inputValue) }
          : stu
      )
    );
    setEditing(null);
  };

  // 엔터키 입력
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <p>학년</p><Input placeholder="학년" className="w-[48px] h-[18px]"   onChange={e => setGrade(e.target.value)} />
          <p className="ml-[22px]">반</p><Input placeholder="반" className="w-[48px] h-[18px] "   onChange={e => setClassNum(e.target.value)}/>
          <p className="ml-[22px]">번호</p><Input placeholder="번호" className="w-[48px] h-[18px] "   onChange={e => setStudentNum(e.target.value)} />
          <p className="ml-[22px]">연도</p><Input placeholder="연도" className="w-[48px] h-[18px]"   onChange={e => setYear(e.target.value)}         />
          <p className="ml-[22px]"> 학기</p><Input placeholder="학기" className="w-[48px] h-[18px] "  onChange={e => setSemester(e.target.value)}          />
          <p className="ml-[22px]">과목</p><Input placeholder="과목" className="w-[48px] h-[18px] border border-[#A9A9A9]" defaultValue="국어"   onChange={e => setSubject(e.target.value)}  />
        </div>

        <div className="flex justify-end mt-4">
          <Button>저장</Button>
        </div>


        {allFilled ? (
        <>
        <p className=" font-nanum-gothic font-semibold text-[20px] leading-[23px]
    flex items-center
    text-black mb-[5px]">{subject}</p>

        
        <div className="overflow-x-auto border-[#A9A9A9] ">
          <table className="min-w-full text-sm text-center ">
            <thead className="">
              <tr>
                {[
                  "번호", "성명", "중간고사", "기말고사", "수행평가1", "수행평가2",
                  "총점", "환산", "평균", "표준편차", "석차", "등급", "피드백(비고)"
                ].map((header) => (
                  <th key={header} className="px-2 py-2 border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.번호}
                  onClick={() => setSelectedRow(student.번호)}
                  className={cn(
                    "hover:bg-blue-100",
                    selectedRow === student.번호 && "bg-blue-200"
                  )}
                >
                  <td className="border px-2 py-1">{student.번호}</td>
                  <td className="border px-2 py-1">{student.성명}</td>
                  {(["중간고사", "기말고사", "수행평가1", "수행평가2"] as ScoreKey[]).map((key) => (
                    <td
                      key={key}
                      className="border px-2 py-1 cursor-pointer"
                      onClick={() => handleCellClick(student.번호, key, student[key])}
                    >
                      {editing && editing.row === student.번호 && editing.key === key ? (
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
                        student[key] ?? "-"
                      )}
                    </td>
                  ))}
                  {Array(7).fill(null).map((_, i) => (
                    <td key={i} className="border px-2 py-1">-</td>
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