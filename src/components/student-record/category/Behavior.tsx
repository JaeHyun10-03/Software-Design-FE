import React from "react";
import Input from "../Input";
import Button from "@/components/shared/Button";

export default function Behavior() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">행동</label>
        <Input placeholder="행동을 작성해주세요"></Input>
      </div>
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">행동 피드백</label>
        <Input placeholder="행동 피드백을 작성해주세요"></Input>
      </div>
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">태도</label>
        <Input placeholder="태도를 작성해주세요"></Input>
      </div>
      <div className="flex-1 flex flex-col">
        <label className="mb-2 font-medium">태도 피드백</label>
        <Input placeholder="태도 피드백을 작성해주세요"></Input>
      </div>
      <Button className="w-14 h-12 ml-auto">완료</Button>
    </div>
  );
}
