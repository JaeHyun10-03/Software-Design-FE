import React, { ReactNode, useMemo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import AlertIcon from "@/assets/icons/AlertIcon";
import useLoginStore from "@/store/login-store";
import axios from "axios";
import Button from "./Button";
// import useStudentFilterStore from "@/store/student-filter-store";

export const StudentHeader = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { name } = useLoginStore();
  const [isModal, setIsModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>(["학적"]);
  console.log(selectedReports);
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
      { label: "학적", path: "/student/student-record" },
      { label: "성적", path: "/student/grade" },
      { label: "상담", path: "/student/counsel" },
      { label: "출결", path: "/student/attendance" },
      { label: "행동", path: "/student/behavior" },
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

  const handleButton = () => {
    const accessToken = localStorage.getItem("accessToken");
    const getCounselListPdf = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/reports/counsels/students/{studentId}/history/pdf`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = res.data;
        console.log("PDF 다운로드:", data);
      } catch (err) {
        console.error("학생별 상담 이력 PDF 생성 에러:", err);
      }
    };
    getCounselListPdf();
  };

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
          <Button
            onClick={() => {
              setIsModal(true);
            }}
            className="w-24 h-10 sm:flex hidden"
          >
            보고서
          </Button>
          <p className="hidden sm:flex text-base text-bold text-center">이름 : {name}</p>
          <div onClick={() => router.push("/alert")} aria-label="알림 아이콘" data-testid="alert-icon" className="cursor-pointer mr-8">
            <AlertIcon />
          </div>
        </div>
      </div>
      {children}
      {isModal && (
        <div onClick={() => setIsModal(false)} className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute w-[400px] h-[400px] bg-white z-50 p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base rounded-lg shadow-lg flex flex-col"
          >
            <p className="text-[#333333] text-2xl mb-4">다운로드 받을 보고서를 선택해주세요</p>

            {["학적", "성적", "출결", "상담", "행동"].map((label) => (
              <label key={label} className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  value={label}
                  checked={selectedReports.includes(label)}
                  disabled={label === "학적"} // ✅ 학적은 비활성화
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedReports((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
                  }}
                />
                <span className={`${label === "학적" ? "text-gray-400" : ""} text-xl`}>{label}</span>
              </label>
            ))}

            <div className="flex justify-between mt-auto pt-6">
              <Button
                className="flex flex-1 mx-4 h-10"
                onClick={() => {
                  console.log("선택된 보고서:", selectedReports);
                  setIsModal(false);
                  handleButton(); // 필요 시 여기에 선택된 리스트 전달
                }}
              >
                다운로드
              </Button>
              <Button className="flex flex-1 mx-4 h-10" onClick={() => setIsModal(false)}>
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
