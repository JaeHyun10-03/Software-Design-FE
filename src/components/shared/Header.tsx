import React, { ReactNode, useMemo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import useLoginStore from "@/store/login-store";
import useSelectedDate from "@/store/selected-date-store";
import useStudentFilterStore from "@/store/student-filter-store";
import axios from "axios";
import Button from "./Button";

export const Header = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { name } = useLoginStore();
  const { studentId } = useStudentFilterStore();
  const { year, semester } = useSelectedDate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  const [isModal, setIsModal] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>(["학적"]);

  const isMobile = windowWidth <= 600;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

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

  const handleDownload = () => {
    const accessToken = localStorage.getItem("accessToken");

    const getReportPdf = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/reports/teacher/pdf`,
          {
            studentId,
            year,
            semester,
            includeGrades: selectedReports.includes("성적"),
            includeAttendance: selectedReports.includes("출결"),
            includeCounseling: selectedReports.includes("상담"),
            includeBehavior: selectedReports.includes("행동"),
            includeFeedback: selectedReports.includes("피드백"),
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            responseType: "blob",
          }
        );

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "학생_보고서.pdf";
        a.click();

        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("보고서 PDF 생성 에러:", err);
      }
    };

    getReportPdf();
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
            <p className="text-[#333333] text-base mb-4">전체 미선택 후 다운로드 클릭 시 학적 데이터만 다운로드</p>

            {["성적", "출결", "상담", "행동", "피드백"].map((label) => (
              <label key={label} className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  value={label}
                  checked={selectedReports.includes(label)}
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
                  setIsModal(false);
                  handleDownload();
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
