import React, { ReactNode } from "react";

export default function Button({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={className} onClick={onClick}>
      <div className="flex items-center justify-center rounded-md bg-[#0064ff] w-full h-full cursor-pointer hover:bg-[#0057E6]">
        <p className="text-xl font-bold text-white">{children}</p>
      </div>
    </div>
  );
}
