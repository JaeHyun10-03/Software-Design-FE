import { create } from "zustand";

interface ITeacher {
  grade: string;
  classNumber: string;
  teacherName: string;
  mysubject: string;

  setGrade: (grade: string) => void;
  setClassNumber: (classNumber: string) => void; 
  setTeacherName: (name: string) => void;
  setSubject: (mysubject: string) => void;
}

const useTeacher = create<ITeacher>((set) => ({
  grade: "1",
  classNumber: "1",
  teacherName: "김철수",
  mysubject: "독서와 문법",

  setGrade: (grade: string) => set({ grade }),
  setClassNumber: (classNumber: string) => set({ classNumber }),
  setTeacherName: (teacherName: string) => set({ teacherName }),
  setSubject: (mysubject: string) => set({ mysubject })
}));

export default useTeacher;
