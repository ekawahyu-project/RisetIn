import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
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
  const [advOpen, setAdvOpen] = useState(false);
  const [kampus, setKampus] = useState("");
  const [tahap, setTahap] = useState("");
  const [lisensi, setLisensi] = useState("");
  const [minSuka, setMinSuka] = useState("");

  useEffect(() => {
    const urlQ = searchParams.get("q");
    if (urlQ) setQ(urlQ);
  }, [searchParams]);

  const published = riset.filter((r) => r.status === "diterbitkan");
  const kampusOptions = useMemo(() => [...new Set(published.map((r) => r.kampus))].sort(), [published]);
  const tahapOptions = useMemo(() => [...new Set(published.map((r) => r.tahap))].sort(), [published]);
  const lisensiOptions = useMemo(() => [...new Set(published.map((r) => r.lisensi).filter(Boolean))].sort(), [published]);

  const activeAdvCount = [kampus, tahap, lisensi, minSuka].filter(Boolean).length;

  const resetAdv = () => {
    setKampus("");
    setTahap("");
    setLisensi("");
    setMinSuka("");
  };

  const list = useMemo(() => {
    let data = published;
    if (q.trim()) {
      const s = q.toLowerCase();
      data = data.filter((r) => r.judul.toLowerCase().includes(s) || r.kampus.toLowerCase().includes(s));
    }
    if (cat) data = data.filter((r) => r.kategori === cat);
    if (kampus) data = data.filter((r) => r.kampus === kampus);
    if (tahap) data = data.filter((r) => r.tahap === tahap);
    if (lisensi) data = data.filter((r) => r.lisensi === lisensi);
    if (minSuka) data = data.filter((r) => r.suka >= Number(minSuka));
    if (filter === "populer") data = [...data].sort((a, b) => b.suka - a.suka);
    if (filter === "terbaru") data = [...data].sort((a, b) => (a.id < b.id ? 1 : -1));
    if (filter === "terdekat")
      data = data.filter((r) => r.kampus.includes("Brawijaya")).concat(data.filter((r) => !r.kampus.includes("Brawijaya")));
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riset, q, cat, filter, kampus, tahap, lisensi, minSuka]);

  return (
    <Container wide>
      <PageHeader title="Jelajahi Riset" subtitle="Temukan riset dan inovasi mahasiswa lintas kampus di Indonesia" />

      <div className="rounded-2xl bg-white p-4 shadow-card dark:bg-[#101f2e] dark:ring-1 dark:ring-white/5 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-sky-100 px-3.5 py-2.5 dark:bg-white/5">
            <Search size={16} className="shrink-0 text-brand-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari riset & penelitian"
              className="w-full bg-transparent text-[13.5px] text-ink placeholder:text-brand-300 focus:outline-none dark:text-white"
            />
          </div>
          <button
            onClick={() => setAdvOpen((v) => !v)}
            className={`tap relative flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors sm:shrink-0 ${
              advOpen ? "bg-brand-700 text-white" : "bg-brand-600 text-white hover:bg-brand-700"
            }`}
          >
            <SlidersHorizontal size={16} /> Filter Lanjutan
            {activeAdvCount > 0 && (
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-700">
                {activeAdvCount}
              </span>
            )}
          </button>
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`tap shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                filter === f.key ? "bg-brand-600 text-white" : "bg-sky-100 text-brand-700 dark:bg-white/5 dark:text-brand-200"
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
              !cat ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-sky-50 text-sub ring-1 ring-line dark:bg-white/5 dark:ring-white/10"
            }`}
          >
            Semua Bidang
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`tap shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
                cat === c.id
                  ? "bg-ink text-white dark:bg-white dark:text-ink"
                  : "bg-sky-50 text-sub ring-1 ring-line dark:bg-white/5 dark:ring-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            advOpen ? "mt-4 max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid gap-3 rounded-xl bg-sky-50 p-4 dark:bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            <AdvField label="Kampus">
              <select value={kampus} onChange={(e) => setKampus(e.target.value)} className="input dark:bg-white/5 dark:border-white/10 dark:text-white">
                <option value="">Semua kampus</option>
                {kampusOptions.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </AdvField>
            <AdvField label="Tahap Riset">
              <select value={tahap} onChange={(e) => setTahap(e.target.value)} className="input dark:bg-white/5 dark:border-white/10 dark:text-white">
                <option value="">Semua tahap</option>
                {tahapOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </AdvField>
            <AdvField label="Lisensi">
              <select value={lisensi} onChange={(e) => setLisensi(e.target.value)} className="input dark:bg-white/5 dark:border-white/10 dark:text-white">
                <option value="">Semua lisensi</option>
                {lisensiOptions.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </AdvField>
            <AdvField label="Minimal Suka">
              <select value={minSuka} onChange={(e) => setMinSuka(e.target.value)} className="input dark:bg-white/5 dark:border-white/10 dark:text-white">
                <option value="">Tidak ada minimum</option>
                <option value="50">50+</option>
                <option value="100">100+</option>
                <option value="250">250+</option>
                <option value="500">500+</option>
              </select>
            </AdvField>
          </div>
          {activeAdvCount > 0 && (
            <button
              onClick={resetAdv}
              className="tap mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-brand-600 dark:text-brand-300"
            >
              <RotateCcw size={13} /> Reset filter lanjutan
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {q && <ActiveChip label={`Cari: "${q}"`} onClear={() => setQ("")} />}
        {cat && <ActiveChip label={categories.find((c) => c.id === cat)?.label} onClear={() => setCat(null)} />}
        {kampus && <ActiveChip label={kampus} onClear={() => setKampus("")} />}
        {tahap && <ActiveChip label={tahap} onClear={() => setTahap("")} />}
        {lisensi && <ActiveChip label={lisensi} onClear={() => setLisensi("")} />}
        {minSuka && <ActiveChip label={`${minSuka}+ suka`} onClear={() => setMinSuka("")} />}
      </div>

      <div className="mt-4">
        <p className="mb-3 text-[12.5px] text-sub">{list.length} riset ditemukan</p>
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

function AdvField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11.5px] font-semibold text-ink dark:text-white/80">{label}</label>
      {children}
    </div>
  );
}

function ActiveChip({ label, onClear }) {
  return (
    <span className="fade-up flex items-center gap-1.5 rounded-full bg-brand-600/10 px-3 py-1 text-[11.5px] font-semibold text-brand-700 dark:bg-white/10 dark:text-brand-200">
      {label}
      <button onClick={onClear} className="tap text-brand-500 hover:text-brand-700 dark:text-brand-300">
        <X size={12} />
      </button>
    </span>
  );
}
