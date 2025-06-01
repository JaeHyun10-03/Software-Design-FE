// __tests__/store/useTeacher.test.ts
import { act } from "@testing-library/react";
import useTeacher from "@/store/teacher-store";

describe("useTeacher zustand store", () => {
  beforeEach(() => {
    // Zustand store를 초기화
    const { getState, setState } = useTeacher;
    setState({
      grade: "1",
      classNumber: "1",
      teacherName: "김철수",
      mysubject: "독서와 문법",
      setGrade: getState().setGrade,
      setClassNumber: getState().setClassNumber,
      setTeacherName: getState().setTeacherName,
      setSubject: getState().setSubject,
    });
  });

  it("초기값이 올바르게 설정된다", () => {
    const state = useTeacher.getState();
    expect(state.grade).toBe("1");
    expect(state.classNumber).toBe("1");
    expect(state.teacherName).toBe("김철수");
    expect(state.mysubject).toBe("독서와 문법");
  });

  it("setGrade로 grade가 변경된다", () => {
    act(() => {
      useTeacher.getState().setGrade("3");
    });
    expect(useTeacher.getState().grade).toBe("3");
  });

  it("setClassNumber로 classNumber가 변경된다", () => {
    act(() => {
      useTeacher.getState().setClassNumber("2");
    });
    expect(useTeacher.getState().classNumber).toBe("2");
  });

  it("setTeacherName으로 teacherName이 변경된다", () => {
    act(() => {
      useTeacher.getState().setTeacherName("이영희");
    });
    expect(useTeacher.getState().teacherName).toBe("이영희");
  });

  it("setSubject로 mysubject가 변경된다", () => {
    act(() => {
      useTeacher.getState().setSubject("영어1");
    });
    expect(useTeacher.getState().mysubject).toBe("영어1");
  });
});
