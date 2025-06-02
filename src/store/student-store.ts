import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IStudent {
  grade: string;
  classNumber: string;
  studentNumber: string;
  studentId: string;
  studentName: string;

  setGrade: (grade: string) => void;
  setClassNumber: (classNumber: string) => void;
  setStudentNumber: (studentNumber: string) => void;
  setStudentId: (studentId: string) => void;
  setStudentName: (name: string) => void;
}

const useStudent = create<IStudent>()(
  persist(
    (set) => ({
      grade: "1",
      classNumber: "1",
      studentNumber: "2",
      studentId: "2",
      studentName: "테스트2",
      setGrade: (grade: string) => set({ grade }),
      setClassNumber: (classNumber: string) => set({ classNumber }),
      setStudentNumber: (studentNumber: string) => set({ studentNumber }),
      setStudentId: (studentId: string) => set({ studentId }),
      setStudentName: (studentName: string) => set({ studentName }),
    }),
    {
      name: "student-storage", // localStorage에 저장될 키
    }
  )
);

export default useStudent;
