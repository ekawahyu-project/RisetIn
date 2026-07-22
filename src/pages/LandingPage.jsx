import React, { useState } from "react";
import { 
  Beaker, Building2, ArrowRight, Star, Users, BookOpen, TrendingUp, 
  CheckCircle2, ChevronRight, Zap, Globe, Shield, Sparkles, 
  FlaskConical, Cpu, Leaf, HeartPulse, Wind, Factory,
  GitBranch, Share2, AtSign, Mail, Play, X
} from "lucide-react";
import { useApp } from "../context/AppContext";

// Stats data
const stats = [
  { value: "2.400+", label: "Riset Diterbitkan", icon: BookOpen },
  { value: "380+", label: "Kampus Partner", icon: Building2 },
  { value: "150+", label: "Perusahaan Mitra", icon: Factory },
  { value: "94%", label: "Tingkat Kolaborasi", icon: TrendingUp },
];

// Features
const features = [
  {
    icon: FlaskConical,
    title: "Publikasi Riset",
    desc: "Terbitkan riset secara mudah. Metadata diekstraksi otomatis oleh AI untuk meningkatkan visibilitas di mesin pencari industri.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Cpu,
    title: "Matchmaking AI",
    desc: "Algoritma kecerdasan buatan secara aktif mencocokkan riset mahasiswa dengan kebutuhan nyata industri yang relevan.",
    color: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Users,
    title: "Kolaborasi Terstruktur",
    desc: "Platform kolaborasi berbasis tahapan: Inisiasi → Negosiasi → Pengembangan → Implementasi → Hilirisasi.",
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    icon: Shield,
    title: "IP & Lisensi Aman",
    desc: "Setiap karya riset terlindungi dengan lisensi CC BY-SA atau pilihan lain sesuai kebutuhan peneliti.",
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    icon: Globe,
    title: "Jangkauan Nasional",
    desc: "Terhubung dengan ekosistem riset dari seluruh Indonesia — lintas kampus, lintas sektor industri.",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
  },
  {
    icon: Zap,
    title: "Analitik Real-time",
    desc: "Pantau performa riset: views, likes, kolaborasi, dan tingkat adopsi industri lewat dashboard interaktif.",
    color: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-400",
  },
];

// How it works steps
const howItWorks = [
  { step: "01", title: "Daftar & Verifikasi", desc: "Buat akun mahasiswa atau industri. Profil Anda diverifikasi untuk menjaga kualitas ekosistem." },
  { step: "02", title: "Publikasikan atau Cari", desc: "Mahasiswa mempublikasikan riset; industri mencari solusi lewat Matchmaking AI yang cerdas." },
  { step: "03", title: "Mulai Kolaborasi", desc: "Terhubung langsung. Diskusikan kebutuhan, negosiasikan syarat, dan mulai pengembangan bersama." },
  { step: "04", title: "Hilirisasi Inovasi", desc: "Riset kampus bertransformasi menjadi solusi nyata yang diadopsi industri dan memberi dampak." },
];

// Category pills
const categoryPills = [
  { icon: Leaf, label: "Pertanian", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { icon: Cpu, label: "Teknologi", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { icon: Factory, label: "Manufaktur", color: "bg-orange-500/15 text-orange-300 border-orange-500/30" },
  { icon: HeartPulse, label: "Kesehatan", color: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  { icon: Wind, label: "Lingkungan", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
];

// Modal Login embedded in LandingPage
function LoginModal({ mode: initialMode, onClose, onLogin }) {
  const [mode, setMode] = useState(initialMode || "login");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const isIndustri = /industri/i.test(email);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email });
    }, 650);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box relative w-full max-w-md rounded-3xl bg-[#0a1928] ring-1 ring-white/10 shadow-2xl overflow-hidden">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-brand-600/20 blur-3xl" />

        <div className="relative p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="tap absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Logo */}
          <div className="mb-6 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white shadow-lg">
              R
            </div>
            <span className="text-[17px] font-extrabold text-white tracking-tight">RisetIn</span>
          </div>

          {/* Tab */}
          <div className="mb-7 flex gap-1 rounded-xl bg-white/5 p-1 ring-1 ring-white/10">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <h2 className="text-[22px] font-extrabold text-white tracking-tight leading-tight">
            {mode === "login" ? "Selamat datang kembali 👋" : "Bergabung dengan RisetIn"}
          </h2>
          <p className="mt-1.5 text-[13px] text-white/50">
            {mode === "login" ? "Masuk dan lanjutkan perjalanan riset Anda." : "Mulai jelajahi ekosistem riset & industri Indonesia."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div className="fade-up">
                <label className="mb-2 block text-[12px] font-semibold uppercase tracking-widest text-white/40">
                  Nama Lengkap / Perusahaan
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-[13.5px] text-white placeholder-white/25 outline-none focus:border-brand-400 focus:bg-white/8 focus:ring-2 focus:ring-brand-400/20 transition-all font-['Inter']"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-widest text-white/40">
                Alamat Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-[13.5px] text-white placeholder-white/25 outline-none focus:border-brand-400 focus:bg-white/8 focus:ring-2 focus:ring-brand-400/20 transition-all font-['Inter']"
              />
            </div>

            <div>
              <label className="mb-2 block text-[12px] font-semibold uppercase tracking-widest text-white/40">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-12 text-[13.5px] text-white placeholder-white/25 outline-none focus:border-brand-400 focus:bg-white/8 focus:ring-2 focus:ring-brand-400/20 transition-all font-['Inter']"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {email && (
              <div className="fade-up flex items-center gap-2 rounded-xl bg-brand-500/10 border border-brand-500/20 px-3.5 py-2.5 text-[12px] text-brand-300">
                <Sparkles size={13} className="shrink-0" />
                Terdeteksi masuk sebagai <b>{isIndustri ? "Industri" : "Mahasiswa"}</b>
                {isIndustri ? <Building2 size={13} className="ml-auto shrink-0" /> : <FlaskConical size={13} className="ml-auto shrink-0" />}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="tap group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:shadow-brand-600/50 disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  {mode === "login" ? "Masuk ke RisetIn" : "Buat Akun Gratis"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-[11.5px] text-white/30">
            Demo: email berisi <b className="text-white/50">"industri"</b> → akun Industri. Lainnya → Mahasiswa.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { login } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("login");

  const openLogin = () => { setModalMode("login"); setShowModal(true); };
  const openRegister = () => { setModalMode("register"); setShowModal(true); };

  return (
    <div className="min-h-screen bg-[#060e1a] text-white overflow-x-hidden">
      {/* ========== NAVBAR ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 lg:px-12 glass-dark border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white shadow-lg shadow-brand-600/30">
            R
          </div>
          <span className="text-[17px] font-extrabold tracking-tight">RisetIn</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {["Fitur", "Cara Kerja", "Kategori", "Tentang"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-[13.5px] font-medium text-white/60 hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={openLogin} className="tap hidden rounded-xl px-4 py-2 text-[13px] font-semibold text-white/70 hover:text-white transition-colors sm:block">
            Masuk
          </button>
          <button onClick={openRegister} className="tap btn-primary rounded-xl px-5 py-2.5 text-[13px] font-bold">
            Daftar Gratis
          </button>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 hero-glow-2" />

        {/* Animated blobs */}
        <div className="pointer-events-none absolute top-1/4 left-10 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl blob-morph" style={{ animationDelay: "0s" }} />
        <div className="pointer-events-none absolute bottom-1/4 right-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl blob-morph" style={{ animationDelay: "3s" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center lg:px-8">
          {/* Badge */}
          <div className="fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/15">
            <Sparkles size={13} className="text-amber-400" />
            <span className="text-[12px] font-semibold text-white/70">Platform Hilirisasi Riset #1 di Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="fade-up stagger-1 text-5xl font-black leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            Menjembatani{" "}
            <span className="gradient-text">Riset Kampus</span>
            <br />
            dengan{" "}
            <span className="gradient-text-warm">Industri Nyata</span>
          </h1>

          <p className="fade-up stagger-2 mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/55">
            Satu platform B2B untuk mempercepat hilirisasi inovasi kampus — dari ide mahasiswa, kolaborasi terstruktur, hingga adopsi industri yang berdampak.
          </p>

          {/* CTAs */}
          <div className="fade-up stagger-3 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button onClick={openRegister} className="tap group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-4 text-[15px] font-bold text-white shadow-xl shadow-brand-600/30 transition-all hover:shadow-brand-600/50 hover:-translate-y-1">
              Mulai Sekarang — Gratis
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button onClick={openLogin} className="tap flex items-center gap-2.5 rounded-2xl border border-white/15 px-8 py-4 text-[15px] font-semibold text-white/80 transition-all hover:bg-white/5 hover:border-white/30">
              <Play size={15} className="text-white/60" />
              Sudah punya akun? Masuk
            </button>
          </div>

          {/* Trust badges */}
          <div className="fade-up stagger-4 mt-14 flex flex-wrap items-center justify-center gap-6 text-[12px] text-white/35">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> Gratis untuk mahasiswa</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> AI-powered matchmaking</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> IP terlindungi</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-400" /> 380+ kampus partner</span>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/20 via-brand-800/10 to-brand-900/20" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`fade-up stagger-${i + 1} text-center`}>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-cyan-500/20 ring-1 ring-white/10">
                  <s.icon size={22} className="text-cyan-400" />
                </div>
                <p className="stat-number text-3xl font-black text-white">{s.value}</p>
                <p className="mt-1 text-[12.5px] text-white/45 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="fitur" className="py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <span className="section-label mb-3 block text-brand-400">Apa yang Kami Tawarkan</span>
            <h2 className="text-4xl font-black tracking-tight text-white lg:text-5xl">
              Fitur yang <span className="gradient-text">Mengakselerasi</span>
              <br />Hilirisasi Riset
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-white/50">
              Semua yang Anda butuhkan untuk mengubah riset kampus menjadi inovasi berdampak nyata.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className={`fade-up stagger-${(i % 6) + 1} group relative rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/8 transition-all duration-300 hover:bg-white/[0.06] hover:ring-white/15 cursor-default`}>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} ring-1 ring-white/10`}>
                  <f.icon size={22} className={f.iconColor} />
                </div>
                <h3 className="mb-2 text-[15px] font-bold text-white">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/50">{f.desc}</p>
                <ChevronRight size={16} className="absolute right-5 top-6 text-white/20 transition-all group-hover:right-4 group-hover:text-white/50" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="cara-kerja" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <span className="section-label mb-3 block text-brand-400">Cara Kerja</span>
            <h2 className="text-4xl font-black tracking-tight text-white lg:text-5xl">
              Dari Riset ke Realita,{" "}
              <span className="gradient-text">4 Langkah Mudah</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-10 bottom-10 hidden w-0.5 bg-gradient-to-b from-brand-500/50 via-brand-400/30 to-transparent lg:block" style={{ left: "calc(10% + 24px)" }} />

            <div className="space-y-8">
              {howItWorks.map((item, i) => (
                <div key={item.step} className={`fade-up stagger-${i + 1} flex items-start gap-6`}>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-[13px] font-black text-white shadow-lg shadow-brand-600/30">
                    {item.step}
                  </div>
                  <div className="flex-1 rounded-2xl bg-white/[0.03] p-6 ring-1 ring-white/8">
                    <h3 className="text-[16px] font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section id="kategori" className="py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="section-label mb-3 block text-brand-400">Kategori Riset</span>
          <h2 className="text-3xl font-black text-white lg:text-4xl">
            Jelajahi Riset dari{" "}
            <span className="gradient-text">Berbagai Bidang</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] text-white/50">
            Dari pertanian hingga teknologi AI, ekosistem RisetIn mencakup seluruh spektrum inovasi kampus Indonesia.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {categoryPills.map((c) => (
              <div key={c.label} className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold ${c.color} transition-all hover:scale-105 cursor-default`}>
                <c.icon size={15} />
                {c.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA BOTTOM ========== */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-12 shadow-2xl shadow-brand-900/50">
            {/* Decorative */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <Star size={13} className="text-amber-300" />
                <span className="text-[12px] font-semibold text-white/90">Bergabung sekarang, gratis selamanya untuk mahasiswa</span>
              </div>
              <h2 className="text-4xl font-black leading-tight text-white lg:text-5xl">
                Siap Mengubah Riset
                <br />Menjadi Dampak Nyata?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[15px] text-white/70">
                Bergabunglah dengan ribuan mahasiswa dan perusahaan yang sudah membangun masa depan inovasi Indonesia.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <button onClick={openRegister} className="tap group flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-[15px] font-bold text-brand-700 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                  Daftar Sekarang — Gratis
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={openLogin} className="tap rounded-2xl border border-white/25 px-8 py-4 text-[15px] font-semibold text-white/80 transition-all hover:bg-white/10">
                  Sudah punya akun
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-black text-white">
                R
              </div>
              <span className="text-[15px] font-extrabold text-white">RisetIn</span>
              <span className="text-[12px] text-white/30">— Riset × Industri</span>
            </div>

            <div className="flex gap-4">
              {[GitBranch, Share2, AtSign, Mail].map((Icon, i) => (
                <button key={i} className="tap flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 transition-colors">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[12px] text-white/30">© 2025 RisetIn. Hak cipta dilindungi undang-undang.</p>
            <div className="flex gap-5 text-[12px] text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white/60 transition-colors">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white/60 transition-colors">Kontak</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showModal && (
        <LoginModal
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onLogin={(data) => {
            setShowModal(false);
            login(data);
          }}
        />
      )}
    </div>
  );
}
