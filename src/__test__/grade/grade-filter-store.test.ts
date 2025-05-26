// __tests__/store/grade-filter-store.test.ts
import useGradeFilterStore from "@/store/grade-filter-store";

describe("useGradeFilterStore", () => {
  beforeEach(() => {
    // 각 테스트마다 store를 초기화 (zustand v4 이상)
    useGradeFilterStore.setState({
      year: "2025",
      semester: "1",
      subject: "독서와 문법",
      isReady: false,
    });
  });

  it("초기값이 올바르다", () => {
    const state = useGradeFilterStore.getState();
    expect(state.year).toBe("2025");
    expect(state.semester).toBe("1");
    expect(state.subject).toBe("독서와 문법");
    expect(state.isReady).toBe(false);
  });

  it("setYear로 year가 변경된다", () => {
    useGradeFilterStore.getState().setYear("2024");
    expect(useGradeFilterStore.getState().year).toBe("2024");
  });

  it("setSemester로 semester가 변경된다", () => {
    useGradeFilterStore.getState().setSemester("2");
    expect(useGradeFilterStore.getState().semester).toBe("2");
  });

  it("setSubject로 subject가 변경된다", () => {
    useGradeFilterStore.getState().setSubject("수학");
    expect(useGradeFilterStore.getState().subject).toBe("수학");
  });

  it("setReady로 isReady가 변경된다", () => {
    useGradeFilterStore.getState().setReady(true);
    expect(useGradeFilterStore.getState().isReady).toBe(true);
  });

  it("resetFilter로 year/semester/subject가 초기화된다", () => {
    useGradeFilterStore.getState().setYear("2023");
    useGradeFilterStore.getState().setSemester("2");
    useGradeFilterStore.getState().setSubject("영어");
    useGradeFilterStore.getState().resetFilter();
    const state = useGradeFilterStore.getState();
    expect(state.year).toBe("2025");
    expect(state.semester).toBe("1");
    expect(state.subject).toBe("1");
  });
});
