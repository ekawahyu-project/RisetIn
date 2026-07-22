import React, { useState } from "react";

const gradients = {
  pertanian: ["#1a7a52", "#34a06e"],
  teknologi: ["#0f5f82", "#2a8aad"],
  manufaktur: ["#9e5a24", "#c97b3d"],
  kesehatan: ["#a03050", "#c4536b"],
  lingkungan: ["#145f80", "#1c7da3"],
  energi: ["#a07a20", "#c79a2c"],
};

const icons = {
  irrigation: (
    <path d="M12 3c3 4 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 9 7 12 3Z" />
  ),
  "solar-irrigation": (
    <>
      <rect x="4" y="4" width="7" height="5" rx="0.5" />
      <rect x="13" y="4" width="7" height="5" rx="0.5" />
      <path d="M12 12c2.2 2.8 4 5 4 7a4 4 0 0 1-8 0c0-2 1.8-4.2 4-7Z" />
    </>
  ),
  parking: <path d="M7 4h6.5a4.5 4.5 0 1 1 0 9H10v7H7V4Zm3 3v3h3.5a1.5 1.5 0 0 0 0-3H10Z" />,
  robot: (
    <>
      <rect x="5" y="9" width="14" height="10" rx="2" />
      <circle cx="9.5" cy="14" r="1.4" />
      <circle cx="14.5" cy="14" r="1.4" />
      <path d="M12 9V5m-3-2h6" />
    </>
  ),
  posture: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 8v6m0 0-4 7m4-7 4 7m-4-9-4-2m4 2 4-2" />
    </>
  ),
  soil: (
    <>
      <path d="M4 15h16" />
      <path d="M7 15V9m5 6V6m5 9v-4" />
      <circle cx="7" cy="7" r="1.4" />
      <circle cx="12" cy="4" r="1.4" />
      <circle cx="17" cy="9" r="1.4" />
    </>
  ),
  air: (
    <>
      <path d="M4 8h11a3 3 0 1 0-2.6-4.5" />
      <path d="M4 13h14a3 3 0 1 1-2.6 4.5" />
      <path d="M4 18h8" />
    </>
  ),
  turbine: (
    <>
      <path d="M12 12 6 6m6 6 6-6m-6 6v9M6 6c2 2 4 2.8 6 2.8M18 6c-2 2-4 2.8-6 2.8" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),
  aquaponic: (
    <>
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M7 8c3-3 7-3 10 0" />
    </>
  ),
  lms: (
    <>
      <rect x="4" y="5" width="16" height="12" rx="1.6" />
      <path d="M9 21h6M12 17v4" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
};

export default function RisetThumb({ img, imgUrl, kategori, className = "" }) {
  const [imgError, setImgError] = useState(false);

  // If imgUrl provided and no error, render real image
  if (imgUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ borderRadius: "inherit" }}>
        <img
          src={imgUrl}
          alt={kategori || "riset"}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          onError={() => setImgError(true)}
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>
    );
  }

  // Fallback: SVG icon
  const [c1, c2] = gradients[kategori] || gradients.teknologi;
  const gid = `g-${img}-${kategori}`;
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={kategori}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="4" fill={`url(#${gid})`} />
      <g
        transform="translate(0,0)"
        fill="none"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      >
        {icons[img] || icons.lms}
      </g>
    </svg>
  );
}
