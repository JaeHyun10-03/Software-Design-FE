import CounselContent from "@/components/counsel/counselContent";
import { Header } from "@/components/shared/Header";
import StudentFilter from "@/components/shared/StudentFilter";
import StudentList from "@/components/shared/StudentList";
import React, { ReactNode,  useEffect, useState  } from "react";

export default function CounselPage() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

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
  
    // 화면 너비가 600px 이상일 때만 StudentList 표시
    const showStudentList = windowWidth > 600;



  return (
    <div className="mx-0 sm:mx-8 mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2 h-auto sm:h-8">
        <StudentFilter />
      </div>
      <div className="flex flex-row gap-8 mt-4 flex-1">
         {showStudentList && <StudentList />}
       <CounselContent/>
      </div>
    </div>
  );
}

CounselPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
