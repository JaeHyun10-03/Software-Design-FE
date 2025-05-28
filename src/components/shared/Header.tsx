import React, { ReactNode, useMemo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import AlertIcon from "@/assets/icons/AlertIcon";
import useLoginStore from "@/store/login-store";
// import useStudentFilterStore from "@/store/student-filter-store";

export const Header = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { name } = useLoginStore();
  // const { studentId } = useStudentFilterStore();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  // 모바일 화면인지 확인
  const isMobile = windowWidth <= 600;

  useEffect(() => {
    // 윈도우 너비 변경을 감지하는 함수
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 컴포넌트 마운트 시 윈도우 너비 초기화
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

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
          font-bold text-center cursor-pointer
          ${isMobile ? "text-base" : "text-xl"}
          ${router.pathname === item.path ? "text-[#0064FF]" : "text-[#333333]"}
          hover:text-[#0057E6] active:text-[#0064FF]
        `}
          onClick={() => handleNavigation(item.path)}
        >
          {item.label}
        </nav>
      )),
    [menuItems, router.pathname, handleNavigation, isMobile]
  );

  return (
    <header>
      <div className="flex items-center w-full bg-white border-b border-gray-400">
        <Image
          src={"/assets/images/logo.png"}
          alt="로고"
          width={isMobile ? 45 : 71}
          height={isMobile ? 30 : 48}
          onClick={() => {
            router.push("/");
          }}
          className={`cursor-pointer my-auto ${isMobile ? "mx-6" : "mx-8"}`}
        />
        <div className={`flex items-center h-[72px] ${isMobile ? "gap-8" : "gap-16"} ${isMobile ? "ml-1" : "ml-4"}`}>{menuElements}</div>
        <div className="flex flex-row justify-center items-center gap-8 ml-auto ">
          <p className="hidden sm:flex text-base text-bold text-center">이름 : {name}</p>
          <div
            role="button" // 추가
            tabIndex={0} // 키보드 접근 가능하도록 추가
            className={`flex justify-center items-center ml-auto ${isMobile ? "mr-2" : "mr-8"}`}
            onClick={() => {
              router.push("/alert");
            }}
          >
            <AlertIcon />
          </div>
        </div>
      </div>
      {children}
    </header>
  );
};
