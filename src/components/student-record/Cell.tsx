import React, { ReactNode } from "react";

interface CellProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function Cell({ children, onClick }: CellProps) {
  const baseClass = "flex flex-1 items-center justify-center h-16 border border-gray-400";
  const clickableClass = onClick ? "cursor-pointer" : "";

  return (
    <div className={`${baseClass} ${clickableClass}`} onClick={onClick}>
      <p className="text-base text-center text-gray-800">{children}</p>
    </div>
  );
}
