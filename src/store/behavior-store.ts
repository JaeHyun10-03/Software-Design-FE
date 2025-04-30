import { create } from "zustand";

interface IBehavior {
  behavior: string;
  behaviorId: number;
  generalComment: string;
  setBehavior: (behavior: string) => void;
  setBehaviorId: (behaviorId: number) => void;
  setGeneralComment: (generalComment: string) => void;
}

const useBehaviorStore = create<IBehavior>((set) => ({
  behavior: "",
  behaviorId: 0,
  generalComment: "",
  setBehavior: (behavior: string) => {
    set({ behavior });
  },
  setBehaviorId: (behaviorId: number) => {
    set({ behaviorId });
  },
  setGeneralComment: (generalComment: string) => {
    set({ generalComment });
  },
}));

export default useBehaviorStore;
