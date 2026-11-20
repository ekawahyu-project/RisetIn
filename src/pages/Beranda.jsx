import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Sparkles, UploadCloud } from "lucide-react";
import { useApp } from "../context/AppContext";
import { RisetCardGrid } from "../components/RisetCard";
import Container from "../components/Container";

function StatCard({ label, value, onClick, delay = 0 }) {
  return (
    <button
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className="stat-lift fade-up w-full rounded-2xl bg-white p-4 text-left shadow-card dark:bg-[#101f2e] dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-5 cursor-pointer"
    >
      <p className="text-2xl font-extrabold text-ink dark:text-white">{value}</p>
      <p className="text-[12.5px] text-sub">{label}</p>
    </button>
  );
}

export default function Beranda() {
  const { user, role, riset } = useApp();
  const navigate = useNavigate();

  if (role === "industri") {
    const published = riset.filter((r) => r.status === "diterbitkan" || r.status === "diadopsi");
    const terbaru = published.slice(0, 8);
    return (
      <Container wide>
        <div className="fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <p className="relative text-[13px] text-white/70">Selamat datang,</p>
          <h1 className="relative mt-1 text-2xl font-extrabold sm:text-3xl">{user.nama}</h1>
          <p className="relative mt-2 max-w-lg text-[13px] leading-relaxed text-white/75">
            Temukan riset mahasiswa yang paling relevan dengan kebutuhan bisnis Anda lewat Matchmaking AI, atau jelajahi katalog riset
            dari berbagai kampus.
          </p>
          <button
            onClick={() => navigate("/matchmaking")}
            className="tap relative mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-brand-700 shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Sparkles size={16} /> Coba Matchmaking AI
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Kebutuhan Aktif" value={user.stats.kebutuhan} onClick={() => navigate("/kolaborasi")} delay={0} />
          <StatCard label="Kolaborasi" value={user.stats.kolaborasi} onClick={() => navigate("/kolaborasi")} delay={40} />
          <StatCard label="Total Riset" value={published.length} onClick={() => navigate("/riset")} delay={80} />
          <StatCard label="Diadopsi" value={user.stats.diadopsi} delay={120} />
        </div>

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink dark:text-white">Riset terbaru untuk Anda</h2>
            <button
              onClick={() => navigate("/riset")}
              className="tap flex items-center text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
            >
              Lihat semua <ChevronRight size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 items-stretch sm:grid-cols-3 lg:grid-cols-4">
            {terbaru.map((r) => (
              <RisetCardGrid key={r.id} r={r} />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  const risetTerbaru = riset.filter((r) => r.status !== "draf").slice(0, 4);

  return (
    <Container wide>
      <div className="fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[13px] text-white/70">Halo, {user.nama.split(" ")[0]}</p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Selamat datang kembali!</h1>
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-white/75">
              Bagikan hasil risetmu dan jangkau industri yang tepat lewat RisetIn.
            </p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="tap inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-bold text-brand-700 shadow-soft transition-transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <UploadCloud size={16} /> Upload Riset
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Riset Saya" value={user.stats.riset} onClick={() => navigate("/riset-saya")} delay={0} />
        <StatCard label="Kolaborasi Aktif" value={user.stats.kolaborasi} onClick={() => navigate("/kolaborasi")} delay={40} />
        <StatCard label="Pengunjung" value={user.stats.pengunjung} delay={80} />
        <StatCard label="Diadopsi" value={user.stats.diadopsi} onClick={() => navigate("/riset-saya")} delay={120} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink dark:text-white">Riset terbaru</h2>
          <button
            onClick={() => navigate("/riset")}
            className="tap flex items-center text-[12.5px] font-semibold text-brand-600 dark:text-brand-300"
          >
            Lihat semua <ChevronRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 items-stretch sm:grid-cols-3 lg:grid-cols-4">
          {risetTerbaru.map((r) => (
            <RisetCardGrid key={r.id} r={r} />
          ))}
        </div>
      </div>
    </Container>
  );
}
