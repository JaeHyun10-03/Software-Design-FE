import { create } from "zustand";

interface GradeFilterStore {
  year: string;
  semester: string;
  subject: string;
  isReady: boolean;
  setYear: (grade: string) => void;
  setSemester: (classNumber: string) => void;
  setSubject: (studentNumber: string) => void;
  setReady: (ready: boolean) => void;
  resetFilter: () => void;
}

const useStudentFilterStore = create<GradeFilterStore>((set) => ({
  year: "2025",
  semester: "1",
  subject: "독서와 문법",
  isReady: false,
  setYear: (year: string) => set({ year }),
  setSemester: (semester: string) => set({ semester }),
  setSubject: (subject: string) => set({ subject }),
  setReady: (ready: boolean) => set({ isReady: ready }), // ✅ 추가
  resetFilter: () =>
    set({
    year: "2025",
    semester: "1",
    subject: "1",
    }),
}));

export default useStudentFilterStore;