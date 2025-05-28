import React from "react";

export const SaveButton = ({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
  <button
    className="w-[84px] h-[32px] bg-[#0064FF] rounded-[6px] text-white mb-[14px]"
    onClick={onClick}
  >
    저장
  </button>
);
