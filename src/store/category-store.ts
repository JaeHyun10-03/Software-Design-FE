import { create } from "zustand";

interface ICategory {
  category: string;
  setCategory: (category: string) => void;
}

const useCategoryStore = create<ICategory>((set) => ({
  category: "학적",
  setCategory: (category: string) => {
    set({ category });
  },
}));

export default useCategoryStore;
