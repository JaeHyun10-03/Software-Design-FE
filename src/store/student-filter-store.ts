import { create } from "zustand";

interface StudentFilterStore {
  grade: string;
  classNumber: string;
  studentNumber: string;
  studentId: string;
  isReady: boolean;
  setGrade: (grade: string) => void;
  setClassNumber: (classNumber: string) => void;
  setStudentNumber: (studentNumber: string) => void;
  setStudentId: (studentId: string) => void;
  setReady: (ready: boolean) => void;
  resetFilter: () => void;
}

const useStudentFilterStore = create<StudentFilterStore>((set) => ({
  grade: "1",
  classNumber: "1",
  studentNumber: "1",
  studentId: "1",
  isReady: false,
  setGrade: (grade: string) => set({ grade }),
  setClassNumber: (classNumber: string) => set({ classNumber }),
  setStudentNumber: (studentNumber: string) => set({ studentNumber }),
  setStudentId: (studentId: string) => set({ studentId }),
  setReady: (ready: boolean) => set({ isReady: ready }), // ✅ 추가
  resetFilter: () =>
    set({
      grade: "1",
      classNumber: "1",
      studentNumber: "1",
      studentId: "1",
    }),
}));

export default useStudentFilterStore;