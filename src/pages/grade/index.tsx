import { Header } from "@/components/shared/Header";
import React, { ReactNode } from "react";

export default function GradePage() {
  return <div>성적 페이지입니다</div>;
}

GradePage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
