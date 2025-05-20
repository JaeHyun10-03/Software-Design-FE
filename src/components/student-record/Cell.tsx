import React, { ReactNode } from "react";

interface CellProps {
  children?: ReactNode;
  onClick?: () => void;
  type?: "S" | "M" | "L";
}

export default function Cell({ children, onClick, type = "M" }: CellProps) {
  let heightClass = "";

  switch (type) {
    case "S":
      heightClass = "h-8";
      break;
    case "L":
      heightClass = "h-24";
      break;
    case "M":
    default:
      heightClass = "h-16";
      break;
  }

  const clickableClass = onClick ? "cursor-pointer" : "";

  return (
    <div
      onClick={onClick}
      className={`w-full text-center break-words leading-tight flex flex-1 items-center justify-center border border-gray-300 text-sm text-gray-800 ${heightClass} ${clickableClass}`}
    >
      {children}
    </div>
  );
}
