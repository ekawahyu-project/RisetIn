import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, MessageCircle, Heart, Building2 } from "lucide-react";
import RisetThumb from "./RisetThumb";
import { CategoryBadge } from "./Badge";
import { useApp } from "../context/AppContext";

export function RisetCardWide({ r, subtitle }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/riset/${r.id}`)}
      className="tap lift flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-card dark:bg-[#101f2e]"
    >
      <RisetThumb img={r.img} kategori={r.kategori} className="h-14 w-14 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold leading-tight text-ink dark:text-white">{r.judul}</p>
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
  const { toggleLike } = useApp();

  const openDetail = () => navigate(`/riset/${r.id}`);

  const onLike = (e) => {
    e.stopPropagation();
    toggleLike(r.id);
  };

  const onComment = (e) => {
    e.stopPropagation();
    navigate(`/riset/${r.id}/komentar`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(e) => e.key === "Enter" && openDetail()}
      className="tap lift group w-full cursor-pointer rounded-2xl bg-white p-2.5 text-left shadow-card fade-up dark:bg-[#101f2e] dark:shadow-none dark:ring-1 dark:ring-white/5"
    >
      <div className="overflow-hidden rounded-xl">
        <RisetThumb
          img={r.img}
          kategori={r.kategori}
          className="h-24 w-full rounded-xl transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-snug text-ink dark:text-white">{r.judul}</p>
      <div className="mt-1 flex items-center gap-1 text-[11px] text-sub">
        <Building2 size={11} />
        <span className="truncate">{r.kampus}</span>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <CategoryBadge kategori={r.kategori} />
      </div>
      <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2 text-[10.5px] text-sub dark:border-white/10">
        <span className="inline-flex items-center gap-1">
          <Eye size={12} /> {r.views}
        </span>
        <button
          onClick={onComment}
          className="tap inline-flex items-center gap-1 rounded-md px-1 -mx-1 hover:text-brand-600 dark:hover:text-brand-300"
        >
          <MessageCircle size={12} /> {r.komentar}
        </button>
        <button
          onClick={onLike}
          className={`tap ml-auto inline-flex items-center gap-1 rounded-md px-1 -mx-1 ${
            r.liked ? "text-berry" : "hover:text-berry"
          }`}
        >
          <Heart size={12} className={r.liked ? "pop-in fill-berry text-berry" : ""} />
          {r.suka}
        </button>
      </div>
    </div>
  );
}
