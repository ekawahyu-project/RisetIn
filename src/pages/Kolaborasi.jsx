import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Building2, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";
import RisetThumb from "../components/RisetThumb";
import { CategoryBadge } from "../components/Badge";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";

export default function Kolaborasi() {
  const { role } = useApp();
  return (
    <Container wide>
      <PageHeader title="Kolaborasi" subtitle="Kelola permintaan dan proyek kolaborasi Anda" />
      {role === "mahasiswa" ? <KolaborasiMahasiswa /> : <KolaborasiIndustri />}
    </Container>
  );
}

function KolaborasiMahasiswa() {
  const { riset, masuk, berjalan, acceptMasuk, rejectMasuk } = useApp();
  const [tab, setTab] = useState("masuk");
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6 flex gap-5 border-b border-line dark:border-white/10">
        <TabBtn active={tab === "masuk"} onClick={() => setTab("masuk")}>
          Permintaan Masuk
        </TabBtn>
        <TabBtn active={tab === "berjalan"} onClick={() => setTab("berjalan")}>
          Proyek Berjalan
        </TabBtn>
      </div>

      {tab === "masuk" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {masuk.length === 0 && <EmptyState text="Belum ada permintaan kolaborasi masuk." />}
          {masuk.map((m) => {
            const r = riset.find((x) => x.id === m.risetId);
            if (!r) return null;
            return (
              <div key={m.id} className="fade-up rounded-2xl bg-white dark:bg-[#101f2e] p-4 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                    {m.perusahaan.split(" ").slice(-1)[0][0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-ink dark:text-white">{m.perusahaan}</p>
                    <p className="truncate text-[12px] text-sub">{m.pesan}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 dark:bg-white/5 p-2.5">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                    <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
                  </div>
                  <p className="truncate text-[12px] font-medium text-ink dark:text-white">{r.judul}</p>
                </div>
                <div className="mt-2 text-right text-[11px] text-brand-300">{m.waktu}</div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => rejectMasuk(m.id)}
                    className="tap flex-1 rounded-lg bg-berry/10 py-2 text-[12.5px] font-bold text-berry"
                  >
                    Tolak
                  </button>
                  <button
                    onClick={() => acceptMasuk(m.id)}
                    className="tap flex-1 rounded-lg bg-brand-600 py-2 text-[12.5px] font-bold text-white"
                  >
                    Terima
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "berjalan" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {berjalan.length === 0 && <EmptyState text="Belum ada proyek kolaborasi berjalan." />}
          {berjalan.map((p) => {
            const r = riset.find((x) => x.id === p.risetId);
            if (!r) return null;
            return (
              <div key={p.id} className="fade-up rounded-2xl bg-white dark:bg-[#101f2e] p-4 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-ink dark:text-white">{r.judul}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-[12px] text-sub">
                      <Building2 size={12} /> {p.perusahaan}
                    </div>
                    <CategoryBadge kategori={r.kategori} className="mt-1.5" />
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-brand-300">Update: {p.updated}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/kolaborasi/chat/${p.id}`)}
                    className="tap flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-100 dark:bg-white/5 py-2 text-[12.5px] font-bold text-brand-700"
                  >
                    <MessageSquare size={14} /> Hubungi
                  </button>
                  <button
                    onClick={() => navigate(`/kolaborasi/proses/${p.id}`)}
                    className="tap flex-1 rounded-lg bg-brand-600 py-2 text-[12.5px] font-bold text-white"
                  >
                    Lihat Proses
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function KolaborasiIndustri() {
  const { riset, indPengajuan, indBerjalan } = useApp();
  const [tab, setTab] = useState("pengajuan");
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-6 flex gap-5 border-b border-line dark:border-white/10">
        <TabBtn active={tab === "pengajuan"} onClick={() => setTab("pengajuan")}>
          Pengajuan Kolaborasi
        </TabBtn>
        <TabBtn active={tab === "berjalan"} onClick={() => setTab("berjalan")}>
          Proyek Berjalan
        </TabBtn>
      </div>

      {tab === "pengajuan" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indPengajuan.map((p) => {
            const r = riset.find((x) => x.id === p.risetId);
            if (!r) return null;
            return (
              <div key={p.id} className="fade-up rounded-2xl bg-white dark:bg-[#101f2e] p-4 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-ink dark:text-white">{r.judul}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-[12px] text-sub">
                      <Building2 size={12} /> {p.kampus}
                    </div>
                    <CategoryBadge kategori={r.kategori} className="mt-1.5" />
                  </div>
                  {p.status === "menunggu" ? (
                    <span className="shrink-0 rounded-full bg-gold/10 px-2 py-1 text-[10.5px] font-bold text-gold">Menunggu</span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-berry/10 px-2 py-1 text-[10.5px] font-bold text-berry">Ditolak</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "berjalan" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indBerjalan.map((p) => {
            const r = riset.find((x) => x.id === p.risetId);
            if (!r) return null;
            return (
              <div key={p.id} className="fade-up rounded-2xl bg-white dark:bg-[#101f2e] p-4 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                    <RisetThumb img={r.img} imgUrl={r.imgUrl} kategori={r.kategori} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-bold text-ink dark:text-white">{r.judul}</p>
                    <div className="mt-0.5 flex items-center gap-1 text-[12px] text-sub">
                      <Building2 size={12} /> {r.kampus}
                    </div>
                    <CategoryBadge kategori={r.kategori} className="mt-1.5" />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/kolaborasi/chat/${p.id}`)}
                    className="tap flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-100 dark:bg-white/5 py-2 text-[12.5px] font-bold text-brand-700"
                  >
                    <MessageSquare size={14} /> Hubungi
                  </button>
                  <button
                    onClick={() => navigate(`/kolaborasi/proses/${p.id}`)}
                    className="tap flex-1 rounded-lg bg-brand-600 py-2 text-[12.5px] font-bold text-white"
                  >
                    Lihat Proses
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`tap -mb-px border-b-2 pb-3 text-[13.5px] font-semibold transition-colors ${
        active
          ? "border-brand-600 text-brand-700 dark:border-brand-300 dark:text-brand-200"
          : "border-transparent text-sub hover:text-ink dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }) {
  return (
    <div className="col-span-full flex flex-col items-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-[#101f2e] shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
        <Inbox size={26} className="text-brand-300" />
      </div>
      <p className="mt-3 text-[13px] text-sub">{text}</p>
    </div>
  );
}
