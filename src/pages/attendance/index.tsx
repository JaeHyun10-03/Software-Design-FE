import { Header } from "@/components/shared/Header";
import React, { ReactNode } from "react";

export default function AttendancePage() {
  return <div>출결 페이지입니다</div>;
}

AttendancePage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
