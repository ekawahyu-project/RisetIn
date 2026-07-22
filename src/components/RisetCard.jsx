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
      className="tap lift flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-card dark:bg-[#101f2e] transition-all duration-300"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
      </div>
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
      className="group riset-card fade-up w-full cursor-pointer shadow-card dark:shadow-none"
    >
      {/* Image / Thumbnail */}
      <div className="relative overflow-hidden rounded-t-[1.15rem]" style={{ aspectRatio: "16/9" }}>
        <RisetThumb
          img={r.img}
          imgUrl={r.imgUrl}
          kategori={r.kategori}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Category badge on top of image */}
        <div className="absolute top-2 left-2">
          <CategoryBadge kategori={r.kategori} />
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink dark:text-white">
          {r.judul}
        </p>
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-sub">
          <Building2 size={10} className="shrink-0" />
          <span className="truncate">{r.kampus}</span>
        </div>

        {/* Stats */}
        <div className="mt-2.5 flex items-center gap-3 border-t border-line pt-2 text-[10.5px] text-sub dark:border-white/10">
          <span className="inline-flex items-center gap-1">
            <Eye size={11} /> {r.views}
          </span>
          <button
            onClick={onComment}
            className="tap inline-flex items-center gap-1 rounded-md -mx-1 px-1 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
          >
            <MessageCircle size={11} /> {r.komentar}
          </button>
          <button
            onClick={onLike}
            className={`tap ml-auto inline-flex items-center gap-1 rounded-md -mx-1 px-1 transition-colors ${
              r.liked ? "text-berry" : "hover:text-berry"
            }`}
          >
            <Heart size={11} className={r.liked ? "pop-in fill-berry text-berry" : ""} />
            {r.suka}
          </button>
        </div>
      </div>
    </div>
  );
}
