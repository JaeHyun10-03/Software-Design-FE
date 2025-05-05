import { create } from "zustand";

interface StudentFilterStore {
  grade: string;
  classNumber: string;
  studentNumber: string;
  setGrade: (grade: string) => void;
  setClassNumber: (classNumber: string) => void;
  setStudentNumber: (studentNumber: string) => void;
  resetFilter: () => void;
  setInitialFilter: (grade: string, classNumber: string, studentNumber: string) => void; // 추가
}

const useStudentFilterStore = create<StudentFilterStore>((set) => ({
  grade: "1",
  classNumber: "1",
  studentNumber: "1",
  setGrade: (grade: string) => set({ grade }),
  setClassNumber: (classNumber: string) => set({ classNumber }),
  setStudentNumber: (studentNumber: string) => set({ studentNumber }),
  resetFilter: () =>
    set({
      grade: "1",
      classNumber: "1",
      studentNumber: "1",
    }),
  setInitialFilter: (grade, classNumber, studentNumber) =>
    set({ grade, classNumber, studentNumber }),
}));

export default useStudentFilterStore;
