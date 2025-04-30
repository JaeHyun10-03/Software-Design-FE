import { create } from "zustand";

interface ISelectedDate {
  year: number;
  month: number;
  semester: number;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setSemester: (semester: number) => void;
  setAll: (date: ISelectedDate) => void;
  reset: () => void;
}

const useSelectedDate = create<ISelectedDate>((set) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  semester: 1,
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setSemester: (semester) => set({ semester }),
  setAll: ({ year, month, semester }) => set({ year, month, semester }),
  reset: () =>
    set({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      semester: 1,
    }),
}));

export default useSelectedDate;
