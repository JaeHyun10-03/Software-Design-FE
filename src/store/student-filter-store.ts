import { create } from "zustand";

interface StudentFilterStore {
  grade: string;
  classNumber: string;
  studentNumber: string;
  setGrade: (grade: string) => void;
  setClassNumber: (classNumber: string) => void;
  setStudentNumber: (studentNumber: string) => void;
  resetFilter: () => void;
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
}));

export default useStudentFilterStore;
