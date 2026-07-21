import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "../context/AppContext";
import { RisetCardGrid } from "../components/RisetCard";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import { categories } from "../data/mockData";

const filters = [
  { key: "semua", label: "Semua" },
  { key: "terbaru", label: "Terbaru" },
  { key: "populer", label: "Populer" },
  { key: "terdekat", label: "Terdekat" },
];

export default function Riset() {
  const { riset } = useApp();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("semua");
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [cat, setCat] = useState(null);

  useEffect(() => {
    const urlQ = searchParams.get("q");
    if (urlQ) setQ(urlQ);
  }, [searchParams]);

  const list = useMemo(() => {
    let data = riset.filter((r) => r.status === "diterbitkan");
    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter((r) => r.judul.toLowerCase().includes(s) || r.kampus.toLowerCase().includes(s));
    }
    if (cat) data = data.filter((r) => r.kategori === cat);
    if (filter === "populer") data = [...data].sort((a, b) => b.suka - a.suka);
    if (filter === "terbaru") data = [...data].sort((a, b) => (a.id < b.id ? 1 : -1));
    if (filter === "terdekat")
      data = data.filter((r) => r.kampus.includes("Brawijaya")).concat(data.filter((r) => !r.kampus.includes("Brawijaya")));
    return data;
  }, [riset, q, cat, filter]);

  return (
    <Container wide>
      <PageHeader title="Jelajahi Riset" subtitle="Temukan riset dan inovasi mahasiswa lintas kampus di Indonesia" />

      <div className="rounded-2xl bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-sky-100 px-3.5 py-2.5">
            <Search size={16} className="shrink-0 text-brand-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari riset & penelitian"
              className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-brand-300 focus:outline-none"
            />
          </div>
          <button className="tap flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-[13px] font-semibold text-white sm:shrink-0">
            <SlidersHorizontal size={16} /> Filter Lanjutan
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`tap shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold ${
                filter === f.key ? "bg-brand-600 text-white" : "bg-sky-100 text-brand-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setCat(null)}
            className={`tap shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
              !cat ? "bg-ink text-white" : "bg-sky-50 text-sub ring-1 ring-line"
            }`}
          >
            Semua Bidang
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`tap shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
                cat === c.id ? "bg-ink text-white" : "bg-sky-50 text-sub ring-1 ring-line"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {list.length === 0 ? (
          <p className="mt-10 text-center text-[13px] text-sub">Tidak ada riset yang cocok.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((r) => (
              <RisetCardGrid key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
