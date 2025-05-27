import { create } from "zustand";

interface Student {
  number: number;
  name: string;
  studentId: string;
}

interface StudentFilterStore {
  grade: string;
  classNumber: string;
  studentNumber: string;
  studentId: string;
  isReady: boolean;
  students: Student[]; // ✅ 추가됨

  setGrade: (grade: string) => void;
  setClassNumber: (classNumber: string) => void;
  setStudentNumber: (studentNumber: string) => void;
  setStudentId: (studentId: string) => void;
  setReady: (ready: boolean) => void;
  setStudents: (students: Student[]) => void; // ✅ 추가됨
  resetFilter: () => void;
}

const useStudentFilterStore = create<StudentFilterStore>((set) => ({
  grade: "1",
  classNumber: "1",
  studentNumber: "1",
  studentId: "1",
  isReady: false,
  students: [], // ✅ 초기값 설정

  setGrade: (grade: string) => set({ grade }),
  setClassNumber: (classNumber: string) => set({ classNumber }),
  setStudentNumber: (studentNumber: string) => set({ studentNumber }),
  setStudentId: (studentId: string) => set({ studentId }),
  setReady: (ready: boolean) => set({ isReady: ready }),
  setStudents: (students: Student[]) => set({ students }), // ✅ 추가됨

  resetFilter: () =>
    set({
      grade: "1",
      classNumber: "1",
      studentNumber: "1",
      studentId: "1",
      students: [], // ✅ 초기화 시 students도 비워줌
    }),
}));

export default useStudentFilterStore;
