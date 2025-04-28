import useCategoryStore from "@/store/category-store";
import React from "react";

export const Category = () => {
  const categoryList = ["학적", "성적", "출결", "행동", "상담"];
  const { category, setCategory } = useCategoryStore();
  return (
    <>
      <div className="w-full h-8">
        <div className="flex w-full h-full">
          {categoryList.map((categoryData, index) => (
            <div
              key={index}
              className={`flex-1 flex items-center justify-center py-1 border border-solid border-[#a9a9a9] cursor-pointer ${category === categoryData ? "bg-[#4DAAF880]" : ""}`}
              onClick={() => setCategory(categoryData)}
            >
              <div className="font-normal text-[#333333] text-base text-center font-['Nanum_Gothic-Regular',Helvetica]">{categoryData}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
