import { create } from "zustand";

interface ILogin {
  name: string;
  setName: (name: string) => void;
}

const useLoginStore = create<ILogin>((set) => ({
  name: "",
  setName: (name: string) => {
    set({ name });
  },
}));

export default useLoginStore;
