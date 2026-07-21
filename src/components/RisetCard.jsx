import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, MessageCircle, Heart, Building2 } from "lucide-react";
import RisetThumb from "./RisetThumb";
import { CategoryBadge } from "./Badge";

export function RisetCardWide({ r, subtitle }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/riset/${r.id}`)}
      className="tap flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-card"
    >
      <RisetThumb img={r.img} kategori={r.kategori} className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-ink">{r.judul}</p>
        <p className="mt-0.5 truncate text-[11px] text-sub">{subtitle || r.kampus}</p>
        <div className="mt-1">
          <CategoryBadge kategori={r.kategori} />
        </div>
      </div>
    </button>
  );
}

export function RisetCardGrid({ r }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/riset/${r.id}`)}
      className="tap w-full rounded-2xl bg-white p-2.5 text-left shadow-card fade-up"
    >
      <RisetThumb img={r.img} kategori={r.kategori} className="h-24 w-full rounded-xl" />
      <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-ink">{r.judul}</p>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-sub">
        <Building2 size={11} />
        <span className="truncate">{r.kampus}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <CategoryBadge kategori={r.kategori} />
      </div>
      <div className="mt-2 flex items-center gap-3 text-[10.5px] text-sub">
        <span className="inline-flex items-center gap-1">
          <Eye size={12} /> {r.views}
        </span>
        <span className="inline-flex items-center gap-1">
          <MessageCircle size={12} /> {r.komentar}
        </span>
        <span className="inline-flex items-center gap-1">
          <Heart size={12} /> {r.suka}
        </span>
      </div>
    </button>
  );
}
