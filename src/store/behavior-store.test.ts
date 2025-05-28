import useBehaviorStore from "./behavior-store";
import { act } from "react-dom/test-utils";

describe("useBehaviorStore", () => {
  beforeEach(() => {
    // 초기 상태로 되돌리기
    const { setBehavior, setBehaviorId, setGeneralComment } = useBehaviorStore.getState();
    act(() => {
      setBehavior("");
      setBehaviorId(0);
      setGeneralComment("");
    });
  });

  it("initializes with default values", () => {
    const { behavior, behaviorId, generalComment } = useBehaviorStore.getState();
    expect(behavior).toBe("");
    expect(behaviorId).toBe(0);
    expect(generalComment).toBe("");
  });

  it("sets behavior", () => {
    const { setBehavior } = useBehaviorStore.getState();
    act(() => {
      setBehavior("협동적인 태도");
    });
    const { behavior } = useBehaviorStore.getState();
    expect(behavior).toBe("협동적인 태도");
  });

  it("sets behaviorId", () => {
    const { setBehaviorId } = useBehaviorStore.getState();
    act(() => {
      setBehaviorId(42);
    });
    const { behaviorId } = useBehaviorStore.getState();
    expect(behaviorId).toBe(42);
  });

  it("sets generalComment", () => {
    const { setGeneralComment } = useBehaviorStore.getState();
    act(() => {
      setGeneralComment("긍정적인 학습 태도를 보입니다.");
    });
    const { generalComment } = useBehaviorStore.getState();
    expect(generalComment).toBe("긍정적인 학습 태도를 보입니다.");
  });
});
