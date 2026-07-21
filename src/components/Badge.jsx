import React from "react";
import { catMap } from "../data/mockData";

export function CategoryBadge({ kategori, className = "" }) {
  const c = catMap[kategori];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${c.color} ${className}`}
    >
      {c.label}
    </span>
  );
}

export function Pill({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-medium text-brand-700 ${className}`}
    >
      {children}
    </span>
  );
}
