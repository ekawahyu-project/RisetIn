import React, { useState } from "react";
import { Package } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import { RisetCardGrid } from "../components/RisetCard";
import { useApp } from "../context/AppContext";
import { risetSayaIds, statusRisetSaya } from "../data/mockData";

const tabs = [
  { key: "diterbitkan", label: "Diterbitkan" },
  { key: "diadopsi", label: "Diadopsi" },
  { key: "draf", label: "Draf" },
  { key: "arsip", label: "Arsip" },
];

export default function RisetSaya() {
  const { riset } = useApp();
  const [tab, setTab] = useState("diterbitkan");

  const mine = riset.filter((r) => risetSayaIds.includes(r.id));
  const filtered = mine.filter((r) => (statusRisetSaya[r.id] || "diterbitkan") === tab);

  return (
    <Container wide>
      <PageHeader title="Riset Saya" subtitle="Kelola dan pantau performa riset yang telah Anda unggah" />

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-line dark:border-white/10">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tap shrink-0 -mb-px border-b-2 px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
              tab === t.key
                ? "border-brand-600 text-brand-700 dark:border-brand-300 dark:text-brand-200"
                : "border-transparent text-sub hover:text-ink dark:hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-card dark:bg-[#101f2e] dark:ring-1 dark:ring-white/5">
            <Package size={26} className="text-brand-300" />
          </div>
          <p className="mt-3 text-sm font-semibold text-ink dark:text-white">Arsip Kosong :(</p>
          <p className="mt-1 text-[12.5px] text-sub">Belum ada riset pada kategori ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((r) => (
            <RisetCardGrid key={r.id} r={r} />
          ))}
        </div>
      )}
    </Container>
  );
}
