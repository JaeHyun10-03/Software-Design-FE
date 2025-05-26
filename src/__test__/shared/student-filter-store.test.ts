// __tests__/store/student-filter-store.test.ts
import useStudentFilterStore from "@/store/student-filter-store";

describe("useStudentFilterStore", () => {
  beforeEach(() => {
    // 테스트마다 store 상태 초기화
    useStudentFilterStore.setState({
      grade: "1",
      classNumber: "1",
      studentNumber: "1",
      studentId: "1",
      isReady: false,
    });
  });

  it("초기값이 올바르다", () => {
    const state = useStudentFilterStore.getState();
    expect(state.grade).toBe("1");
    expect(state.classNumber).toBe("1");
    expect(state.studentNumber).toBe("1");
    expect(state.studentId).toBe("1");
    expect(state.isReady).toBe(false);
  });

  it("setGrade로 grade가 변경된다", () => {
    useStudentFilterStore.getState().setGrade("3");
    expect(useStudentFilterStore.getState().grade).toBe("3");
  });

  it("setClassNumber로 classNumber가 변경된다", () => {
    useStudentFilterStore.getState().setClassNumber("5");
    expect(useStudentFilterStore.getState().classNumber).toBe("5");
  });

  it("setStudentNumber로 studentNumber가 변경된다", () => {
    useStudentFilterStore.getState().setStudentNumber("12");
    expect(useStudentFilterStore.getState().studentNumber).toBe("12");
  });

  it("setStudentId로 studentId가 변경된다", () => {
    useStudentFilterStore.getState().setStudentId("9999");
    expect(useStudentFilterStore.getState().studentId).toBe("9999");
  });

  it("setReady로 isReady가 변경된다", () => {
    useStudentFilterStore.getState().setReady(true);
    expect(useStudentFilterStore.getState().isReady).toBe(true);
  });

  it("resetFilter로 모든 값이 초기화된다", () => {
    useStudentFilterStore.getState().setGrade("2");
    useStudentFilterStore.getState().setClassNumber("3");
    useStudentFilterStore.getState().setStudentNumber("4");
    useStudentFilterStore.getState().setStudentId("8888");
    useStudentFilterStore.getState().setReady(true);

    useStudentFilterStore.getState().resetFilter();
    const state = useStudentFilterStore.getState();
    expect(state.grade).toBe("1");
    expect(state.classNumber).toBe("1");
    expect(state.studentNumber).toBe("1");
    expect(state.studentId).toBe("1");
    // isReady는 resetFilter에서 초기화하지 않으므로 true 유지됨
    expect(state.isReady).toBe(true);
  });
});
