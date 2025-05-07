import React, { ReactNode, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import AlertIcon from "@/assets/icons/AlertIcon";

export const Header = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const menuItems = useMemo(
    () => [
      { label: "학적", path: "/student-record" },
      { label: "성적", path: "/grade" },
      { label: "상담", path: "/counsel" },
      { label: "출결", path: "/attendance" },
      { label: "행동", path: "/behavior" },
    ],
    []
  );

  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const menuElements = useMemo(
    () =>
      menuItems.map((item, index) => (
        <nav
          key={index}
          className={`
          font-bold text-xl text-center cursor-pointer
          ${router.pathname === item.path ? "text-[#0064FF]" : "text-[#333333]"}
          hover:text-[#0057E6] active:text-[#0064FF]
        `}
          onClick={() => handleNavigation(item.path)}
        >
          {item.label}
        </nav>
      )),
    [menuItems, router.pathname, handleNavigation]
  );

  return (
    <header>
      <div className="flex items-center w-full h-18 bg-white border-b border-gray-400">
        <Image
          src={"/assets/images/logo.png"}
          alt="로고"
          width={71}
          height={48}
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer mx-8 my-auto"
        />
        <div className="flex items-center h-[72px] gap-16 ml-4">{menuElements}</div>
        <div
          className="flex justify-center items-center ml-auto mr-8"
          onClick={() => {
            router.push("/alert");
          }}
        >
          <AlertIcon />
        </div>
      </div>
      {children}
    </header>
  );
};
