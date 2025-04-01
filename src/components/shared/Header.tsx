import React, { ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "@/assets/images/logo.png";

export const Header = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // 헤더 내 페이지 데이터
  const menuItems = [
    { label: "학적", path: "/student-record" },
    { label: "성적", path: "/grade" },
    { label: "상담", path: "/counsel" },
    { label: "출결", path: "/attendance" },
    { label: "행동", path: "/behavior" },
  ];

  return (
    <>
      <div className="flex items-center w-full h-18 bg-white border-b border-gray-400">
        <Image src={logo} alt="로고" height={64} />
        <div className="flex items-center gap-16 ml-4">
          {menuItems.map((item, index) => (
            <div key={index} className="font-bold text-xl text-center text-[#333333] cursor-pointer" onClick={() => router.push(item.path)}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
      {children}
    </>
  );
};
