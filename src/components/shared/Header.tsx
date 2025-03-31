import React, { ReactNode } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.png";

export const Header = ({ children }: { children: ReactNode }) => {
  // 헤더 내 페이지 데이터
  const menuItems = ["학적", "성적", "상담", "출결", "행동"];

  return (
    <>
      <div className="flex items-center w-full h-18 bg-white border-b border-gray-400">
        <Image src={logo} alt="로고" height={64} />
        <div className="flex items-center gap-16 ml-4">
          {menuItems.map((item, index) => (
            <div key={index} className="font-bold text-xl text-center text-[#333333] cursor-pointer">
              {item}
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  );
};
