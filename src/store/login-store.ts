import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ILogin {
  name: string;
  setName: (name: string) => void;
}

const useLoginStore = create<ILogin>()(
  persist(
    (set) => ({
      name: "",
      setName: (name: string) => {
        set({ name });
      },
    }),
    {
      name: "login-storage", // localStorage 키 이름
    }
  )
);

export default useLoginStore;
