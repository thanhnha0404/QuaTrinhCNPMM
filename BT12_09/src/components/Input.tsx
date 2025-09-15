import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, style, ...props }) => {
  return (
    <div style={{ marginBottom: "8px" }}>
      {label && <label style={{ marginRight: "8px" }}>{label}</label>}
      <input
        {...props}
        style={{ padding: "6px", borderRadius: "6px", ...(style as React.CSSProperties) }}
      />
    </div>
  );
};



