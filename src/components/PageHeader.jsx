import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({ title, subtitle, back = false, actions = null }) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className="tap flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink shadow-card hover:bg-sky-100"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-[13px] text-sub">{subtitle}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}
