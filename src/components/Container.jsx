import React from "react";

export default function Container({ children, className = "", wide = false }) {
  return (
    <div className={`mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 ${wide ? "max-w-7xl" : "max-w-5xl"} ${className}`}>
      {children}
    </div>
  );
}
