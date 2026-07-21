import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Eye, MessageCircle, Heart, FileText, Users, Building2, HandHeart, Download } from "lucide-react";
import { useApp } from "../context/AppContext";
import RisetThumb from "../components/RisetThumb";
import { CategoryBadge } from "../components/Badge";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";

const tabs = ["Ringkasan", "Dokumen", "Anggota", "Komentar"];

export default function DetailRiset() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { riset, role, showToast } = useApp();
  const [tab, setTab] = useState("Ringkasan");
  const [requested, setRequested] = useState(false);

  const r = riset.find((x) => x.id === id);
  if (!r) {
    return (
      <Container>
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="text-sm font-semibold text-ink">Riset tidak ditemukan</p>
          <button onClick={() => navigate(-1)} className="text-[13px] font-semibold text-brand-600">
            Kembali
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container wide>
      <PageHeader
        title="Detail Riset"
        back
        actions={
          <button className="tap flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-card hover:bg-sky-100">
            <Share2 size={16} />
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-card">
            <RisetThumb img={r.img} kategori={r.kategori} className="h-56 w-full sm:h-72" />

            <div className="p-5 sm:p-6">
              <h2 className="text-xl font-extrabold leading-snug text-ink sm:text-2xl">{r.judul}</h2>
              <div className="mt-2 flex items-center gap-1.5 text-[13px] text-sub">
                <Building2 size={14} />
                {r.kampus}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <CategoryBadge kategori={r.kategori} />
                {r.lisensi && (
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11.5px] font-medium text-brand-700">
                    Lisensi: {r.lisensi}
                  </span>
                )}
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11.5px] font-medium text-brand-700">{r.tahap}</span>
              </div>

              <div className="mt-4 flex items-center gap-5 border-t border-line pt-4 text-[12.5px] text-sub">
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={14} /> {r.views} dilihat
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle size={14} /> {r.komentar} komentar
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={14} /> {r.suka} suka
                </span>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto border-t border-line px-5 sm:px-6">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`shrink-0 border-b-2 px-3 py-3 text-[13.5px] font-semibold ${
                    tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-sub hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {tab === "Ringkasan" && (
                <div className="fade-up space-y-5">
                  <p className="text-[14px] leading-relaxed text-ink/80">{r.ringkasan}</p>
                  <div>
                    <p className="text-[13.5px] font-bold text-ink">Manfaat</p>
                    <ul className="mt-2 space-y-2">
                      {r.manfaat.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13.5px] text-ink/80">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {tab === "Dokumen" && (
                <div className="fade-up grid gap-2.5 sm:grid-cols-2">
                  {["Proposal Riset.pdf", "Dokumentasi Purwarupa.pdf", "Data Uji Coba.xlsx"].map((d, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-sky-50 p-3.5">
                      <FileText size={18} className="shrink-0 text-brand-500" />
                      <span className="flex-1 truncate text-[13px] text-ink">{d}</span>
                      <Download size={15} className="shrink-0 text-brand-400" />
                    </div>
                  ))}
                </div>
              )}

              {tab === "Anggota" && (
                <div className="fade-up grid gap-2.5 sm:grid-cols-2">
                  {[
                    { n: "Eka Wahyu M", role: "Peneliti Utama" },
                    { n: "Cia Rahmawati", role: "Anggota Peneliti" },
                    { n: "Rezha Pratama", role: "Anggota Peneliti" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-sky-50 p-3.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-[12px] font-bold text-white">
                        {m.n.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-ink">{m.n}</p>
                        <p className="text-[11.5px] text-sub">{m.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "Komentar" && (
                <div className="fade-up flex flex-col items-center py-12 text-center">
                  <Users size={28} className="text-brand-300" />
                  <p className="mt-2 text-[13px] text-sub">Belum ada komentar pada riset ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {role === "industri" && (
            <div className="rounded-2xl bg-white p-5 shadow-card">
              <p className="text-[13.5px] font-bold text-ink">Tertarik berkolaborasi?</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-sub">
                Ajukan kolaborasi untuk mendiskusikan implementasi riset ini bersama tim peneliti.
              </p>
              <button
                disabled={requested}
                onClick={() => {
                  setRequested(true);
                  showToast("Pengajuan kolaborasi terkirim");
                }}
                className={`tap mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold text-white ${
                  requested ? "bg-brand-300" : "bg-brand-600"
                }`}
              >
                <HandHeart size={16} />
                {requested ? "Pengajuan Terkirim" : "Ajukan Kolaborasi"}
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-[13.5px] font-bold text-ink">Riset Terkait</p>
            <div className="mt-3 space-y-2.5">
              {riset
                .filter((x) => x.kategori === r.kategori && x.id !== r.id && x.status === "diterbitkan")
                .slice(0, 3)
                .map((x) => (
                  <button
                    key={x.id}
                    onClick={() => navigate(`/riset/${x.id}`)}
                    className="tap flex w-full items-center gap-2.5 rounded-xl bg-sky-50 p-2.5 text-left"
                  >
                    <RisetThumb img={x.img} kategori={x.kategori} className="h-10 w-10 shrink-0 rounded-lg" />
                    <p className="truncate text-[12.5px] font-medium text-ink">{x.judul}</p>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
