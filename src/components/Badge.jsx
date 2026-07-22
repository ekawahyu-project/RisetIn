import React from "react";

/*
  SATU sistem warna untuk badge — konsisten di semua halaman.
  Menggunakan design token asli: leaf, clay, berry, gold, brand.
*/

const CAT = {
  pertanian: {
    label: "Pertanian",
    // untuk di luar gambar (Kolaborasi, Detail, Matchmaking, dsb.)
    cls: "bg-leaf/10 text-leaf border border-leaf/30",
    // untuk di atas foto — frosted glass putih + text warna sama
    textColor: "#22924b",   // leaf
    borderColor: "rgba(34,146,75,0.4)",
  },
  teknologi: {
    label: "Teknologi",
    cls: "bg-brand-500/10 text-brand-600 border border-brand-500/30",
    textColor: "#2c7eb6",   // brand-600
    borderColor: "rgba(44,126,182,0.4)",
  },
  manufaktur: {
    label: "Manufaktur",
    cls: "bg-clay/10 text-clay border border-clay/30",
    textColor: "#c4651a",   // clay
    borderColor: "rgba(196,101,26,0.4)",
  },
  kesehatan: {
    label: "Kesehatan",
    cls: "bg-berry/10 text-berry border border-berry/30",
    textColor: "#c0234b",   // berry
    borderColor: "rgba(192,35,75,0.4)",
  },
  lingkungan: {
    label: "Lingkungan",
    cls: "bg-brand-400/10 text-brand-600 border border-brand-400/30",
    textColor: "#2c7eb6",
    borderColor: "rgba(44,126,182,0.4)",
  },
  energi: {
    label: "Energi Terbarukan",
    cls: "bg-gold/10 text-gold border border-gold/30",
    textColor: "#b87e0a",   // gold
    borderColor: "rgba(184,126,10,0.4)",
  },
};

/** Badge normal — light bg + colored text (Kolaborasi, Detail, Matchmaking, dsb.) */
export function CategoryBadge({ kategori, className = "" }) {
  const c = CAT[kategori];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold ${c.cls} ${className}`}>
      {c.label}
    </span>
  );
}

/**
 * Badge di atas foto — frosted glass putih semi-transparan + teks warna SAMA
 * dengan CategoryBadge agar tema konsisten, tapi tetap terbaca di atas gambar.
 */
export function CategoryBadgeOnImage({ kategori, className = "" }) {
  const c = CAT[kategori];
  if (!c) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-bold shadow-md ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.82)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        color: c.textColor,
        border: `1px solid ${c.borderColor}`,
      }}
    >
      {c.label}
    </span>
  );
}

export function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-medium text-brand-700 ${className}`}>
      {children}
    </span>
  );
}
