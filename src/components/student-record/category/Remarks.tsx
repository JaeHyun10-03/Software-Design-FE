import React from "react";
import Input from "@/components/student-record/Input";
import Button from "@/components/shared/Button";

export default function Remarks() {
  return (
    <div className="flex flex-col h-full gap-4 p-8">
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">특기사항</label>
        <Input placeholder="특기사항을 작성해주세요" className="h-full flex-1 border" />
      </div>

      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">특기사항 피드백</label>
        <Input placeholder="피드백을 작성해주세요 (작성 시 학부모, 학생에게 알림 전달)" className="h-full flex-1 border" />
      </div>
      <Button className="w-20 h-14 ml-auto">저장</Button>
    </div>
  );
}
