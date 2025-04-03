import React from "react";

interface InputProps {
  placeholder?: string;
  className?: string;
}

export default function Input({ placeholder, className }: InputProps) {
  return <textarea placeholder={placeholder} className={`focus:outline-none p-4 h-full flex-1 border ${className || ""}`} />;
}
