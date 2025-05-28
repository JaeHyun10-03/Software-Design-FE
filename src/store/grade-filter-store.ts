import { create } from "zustand";

interface GradeFilterStore {
  year: string;
  semester: string;
  subject: string;
  grade: string;  
  isReady: boolean;
  setYear: (grade: string) => void;
  setSemester: (classNumber: string) => void;
  setSubject: (studentNumber: string) => void;
  setGrade: (grade: string) => void; 
  setReady: (ready: boolean) => void;
  resetFilter: () => void;
}

const useGradeFilterStore = create<GradeFilterStore>((set) => ({
  year: "2025",
  semester: "1",
  subject: "독서와 문법",
  grade: "1", 
  isReady: false,
  setYear: (year: string) => set({ year }),
  setSemester: (semester: string) => set({ semester }),
  setSubject: (subject: string) => set({ subject }),
  setGrade: (grade: string) => set({ grade }), // ✅ 추가
  setReady: (ready: boolean) => set({ isReady: ready }), // ✅ 추가
  resetFilter: () =>
    set({
    year: "2025",
    semester: "1",
    subject: "1",
     grade: "1", 
    }),
}));

export default useGradeFilterStore;