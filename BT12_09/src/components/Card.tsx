import React from "react";

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, title, style }) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        ...(style || {}),
      }}
    >
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
};



