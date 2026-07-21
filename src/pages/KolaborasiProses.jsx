import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import RisetThumb from "../components/RisetThumb";
import { CategoryBadge } from "../components/Badge";
import { tahapanKolaborasi } from "../data/mockData";

export default function KolaborasiProses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { riset, berjalan, indBerjalan, role, advanceStage, showToast } = useApp();

  const proyek = [...berjalan, ...indBerjalan].find((p) => p.id === id);
  if (!proyek) {
    return (
      <Container>
        <p className="py-16 text-center text-[13px] text-sub">Proyek tidak ditemukan</p>
      </Container>
    );
  }
  const r = riset.find((x) => x.id === proyek.risetId);

  return (
    <Container>
      <PageHeader title="Proses Kolaborasi" back />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center gap-3">
              <RisetThumb img={r.img} kategori={r.kategori} className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-ink">{r.judul}</p>
                <p className="truncate text-[12px] text-sub">{r.kampus}</p>
                <CategoryBadge kategori={r.kategori} className="mt-1.5" />
              </div>
            </div>
            {proyek.updated && <p className="mt-3 text-[11px] text-brand-300">Update: {proyek.updated}</p>}
            {proyek.perusahaan && <p className="mt-1 text-[11px] text-brand-300">Mitra: {proyek.perusahaan}</p>}

            <button
              onClick={() => navigate(`/kolaborasi/chat/${proyek.id}`)}
              className="tap mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-100 py-3 text-[13px] font-bold text-brand-700"
            >
              <MessageSquare size={16} /> Buka Percakapan
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <p className="mb-5 text-[14px] font-bold text-ink">Tahapan Kolaborasi</p>
            <div className="space-y-0">
              {tahapanKolaborasi.map((t, i) => {
                const done = i < proyek.tahap;
                const active = i === proyek.tahap;
                const isLast = i === tahapanKolaborasi.length - 1;
                return (
                  <div key={t.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          done ? "bg-brand-600 text-white" : active ? "bg-brand-100 ring-2 ring-brand-600" : "bg-sky-100"
                        }`}
                      >
                        {done && <Check size={14} />}
                        {active && <span className="h-2 w-2 rounded-full bg-brand-600" />}
                      </div>
                      {!isLast && <div className={`w-0.5 flex-1 ${done ? "bg-brand-600" : "bg-line"}`} style={{ minHeight: 38 }} />}
                    </div>
                    <div className="pb-7">
                      <p className={`text-[14px] font-semibold ${done || active ? "text-ink" : "text-sub"}`}>{t.label}</p>
                      <p className="text-[12.5px] text-sub">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {role === "mahasiswa" && proyek.tahap < 4 && (
              <button
                onClick={() => {
                  advanceStage(proyek.id);
                  showToast("Tahapan kolaborasi diperbarui");
                }}
                className="tap w-full rounded-xl bg-brand-600 py-3 text-[13px] font-bold text-white sm:w-auto sm:px-6"
              >
                Tandai Tahap Berikutnya
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
