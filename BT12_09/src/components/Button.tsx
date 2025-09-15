import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label, style, ...props }) => {
  return (
    <button
      {...props}
      style={{
        padding: "8px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        ...(style as React.CSSProperties),
      }}
    >
      {label}
    </button>
  );
};



