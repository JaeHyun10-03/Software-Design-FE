import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, className, onClick, disabled = false }: ButtonProps) {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      <div
        className={`flex items-center justify-center rounded-md w-full h-full select-none
        ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#0064ff] cursor-pointer hover:bg-[#0057E6]"}`}
      >
        <p className={`text-xl font-bold ${disabled ? "text-gray-200" : "text-white"}`}>{children}</p>
      </div>
    </div>
  );
}
