import React, { useState } from "react";
import Button from "../shared/Button";

const BehaviorContent = () => {
  const [behavior, setBehavior] = useState("");
  const [generalOpinion, setGeneralOpinion] = useState("");

  return (
    <div className="w-full h-full border border-[#a9a9a9] p-4">
      <div className="flex flex-col gap-2">
        <p className="text-xl">행동특성</p>
        <textarea className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none"></textarea>
        <Button className="w-16 h-8 ml-auto">저장</Button>
      </div>
      <div className="flex flex-col gap-2 mt-16">
        <p className="text-xl">종합의견</p>
        <textarea className="min-h-48 border border-[#a9a9a9] rounded-md text-[#333333] text-base resize-none p-4 focus:outline-none"></textarea>
        <Button className="w-16 h-8 ml-auto">저장</Button>
      </div>
    </div>
  );
};

export default BehaviorContent;
