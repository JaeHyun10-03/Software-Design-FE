import { Header } from "@/components/shared/Header";
import React, { ReactNode, useState } from "react";

export default function BehaviorPage() {
  return <div>행동 페이지입니다</div>;
}

BehaviorPage.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
