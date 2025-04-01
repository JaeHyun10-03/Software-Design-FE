import React, { ReactNode } from "react";

export const Category = ({ children }: { children: ReactNode }) => {
  const categories = ["학적", "성적", "특기사항", "출결", "행동", "상담"];
  return (
    <>
      <div className="w-full h-8">
        <div className="flex w-full h-full">
          {categories.map((category, index) => (
            <div key={category} className={`flex-1 flex items-center justify-center py-1 border border-solid border-[#a9a9a9] ${index === 0 ? "bg-[#4daaf880]" : ""}`}>
              <div className="font-normal text-[#333333] text-base text-center font-['Nanum_Gothic-Regular',Helvetica]">{category}</div>
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  );
};
