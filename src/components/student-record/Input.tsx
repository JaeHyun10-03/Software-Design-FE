import React from "react";

interface InputProps {
  placeholder?: string;
  className?: string;
}

export default function Input({ placeholder, className }: InputProps) {
  return <textarea placeholder={placeholder} className={className} />;
}
