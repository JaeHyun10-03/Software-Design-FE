import { Header } from "@/components/shared/Header";
import React, { ReactNode, useState } from "react";

export default function StudentRecordPage() {
  const [selectPage, setSelectPage] = useState();

  return <div>안녕하세요</div>;
}

StudentRecordPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};

// 해야하는 일
/**
 * 1. 헤더 만들기 - 성적, 상담, 출결 등 페이지 이동 기능 구현
 * 2. 학적 페이지(학적) 마크업 - 표 공통 컴포넌트 만들기
 *
 *
 *
 */
