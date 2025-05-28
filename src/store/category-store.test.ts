import useCategoryStore from "./category-store";
import { act } from "react-dom/test-utils";

describe("useCategoryStore", () => {
  beforeEach(() => {
    const { setCategory } = useCategoryStore.getState();
    act(() => {
      setCategory("학적"); // 초기 상태로 리셋
    });
  });

  it("초기값이 '학적'이어야 한다", () => {
    const { category } = useCategoryStore.getState();
    expect(category).toBe("학적");
  });

  it("setCategory가 상태를 업데이트한다", () => {
    const { setCategory } = useCategoryStore.getState();
    act(() => {
      setCategory("출결");
    });
    const { category } = useCategoryStore.getState();
    expect(category).toBe("출결");
  });
});
