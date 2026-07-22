import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, MessageCircle, Heart, Building2 } from "lucide-react";
import RisetThumb from "./RisetThumb";
import { CategoryBadge, CategoryBadgeOnImage } from "./Badge";
import { useApp } from "../context/AppContext";


export function RisetCardWide({ r, subtitle }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/riset/${r.id}`)}
      className="tap flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 text-left shadow-card dark:bg-[#101f2e] hover:bg-sky-50 dark:hover:bg-white/5 transition-colors"
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
      /* flex-col + h-full agar semua card sama tinggi, stats selalu di bawah */
      className="group riset-card fade-up flex h-full w-full cursor-pointer flex-col shadow-card dark:shadow-none"
    >
      {/* Gambar — aspect ratio 16/9 fixed */}
      <div className="relative shrink-0 overflow-hidden rounded-t-[1.15rem]" style={{ aspectRatio: "16/9" }}>
        <RisetThumb
          img={r.img}
          imgUrl={r.imgUrl}
          kategori={r.kategori}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Badge kategori berwarna di atas foto */}
        <div className="absolute top-2 left-2">
          <CategoryBadgeOnImage kategori={r.kategori} />
        </div>
      </div>

      {/* Body — flex-col, stats di-push ke bawah dengan mt-auto */}
      <div className="flex flex-1 flex-col p-3">
        {/* Judul — selalu 2 baris agar tinggi konsisten */}
        <p
          className="line-clamp-2 min-h-[2.5rem] text-[13px] font-semibold leading-snug text-ink dark:text-white"
        >
          {r.judul}
        </p>

        {/* Kampus */}
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-sub">
          <Building2 size={10} className="shrink-0" />
          <span className="truncate">{r.kampus}</span>
        </div>

        {/* Stats — mt-auto mendorong ke bawah agar selalu rata-bawah */}
        <div className="mt-auto flex items-center gap-3 border-t border-line pt-2 text-[10.5px] text-sub dark:border-white/10" style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
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
