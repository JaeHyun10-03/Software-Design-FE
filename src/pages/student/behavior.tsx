import BehaviorContent from "@/components/behavior/StudentBehaviorContent";
import { Header } from "@/components/shared/StudentHeader";
import React, { ReactNode } from "react";

export default function Behavior() {
  return (
    <div className="mt-4 mb-8 h-[calc(100vh-120px)] flex flex-col sm:mx-8">
    
      <div className="flex flex-row gap-8 mt-4 flex-1">
       
        <BehaviorContent />
      </div>
    </div>
  );
}

Behavior.getLayout = (page: ReactNode) => {
  return <Header>{page}</Header>;
};
