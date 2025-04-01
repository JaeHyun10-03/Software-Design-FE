import { Header } from "@/components/shared/Header";
import React, { ReactNode, useState } from "react";

export default function CounselPage() {
  return <div>상담페이지입니다</div>;
}
CounselPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
