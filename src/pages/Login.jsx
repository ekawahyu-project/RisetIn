import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, FlaskConical, Building2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, register, demoLogin } = useApp();
  const [mode, setMode] = useState("login"); // login | register
  const [role, setRole] = useState("mahasiswa");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ email: email.trim(), password });
      } else {
        await register({ nama: nama.trim(), email: email.trim(), password, role });
      }
    } catch (err) {
      setError(err.message || "Autentikasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-sky-50 dark:bg-[#0b1420]">
      {/* Left brand panel */}
      <div className="relative hidden w-[46%] overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-brand-300/20 blur-3xl" />

        <div className="relative fade-up">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-black text-white">R</div>
            <span className="text-xl font-extrabold text-white">RisetIn</span>
          </div>
          <h1 className="mt-14 max-w-md text-3xl font-extrabold leading-tight text-white xl:text-4xl">
            Menjembatani riset mahasiswa dengan kebutuhan industri.
          </h1>
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-white/70">
            Satu platform B2B untuk mempercepat hilirisasi inovasi kampus — dari ide, kolaborasi, hingga adopsi industri.
          </p>
        </div>

        <div className="relative fade-up grid grid-cols-1 gap-3" style={{ animationDelay: "0.1s" }}>
          <Feature icon={FlaskConical} title="Untuk Mahasiswa" desc="Terbitkan riset & terhubung langsung dengan industri" />
          <Feature icon={Building2} title="Untuk Industri" desc="Temukan solusi riset lewat Matchmaking AI" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-[54%] lg:px-20">
        <div className="mx-auto w-full max-w-sm fade-up">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-lg font-black text-white">R</div>
            <span className="text-lg font-extrabold text-ink dark:text-white">RisetIn</span>
          </div>

          <div className="mb-7 flex rounded-xl bg-sky-100 p-1 dark:bg-white/5">
            <button
              onClick={() => setMode("login")}
              className={`tap flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
                mode === "login" ? "bg-white text-brand-700 shadow-card dark:bg-brand-600 dark:text-white" : "text-sub"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setMode("register")}
              className={`tap flex-1 rounded-lg py-2.5 text-[13px] font-bold transition-colors ${
                mode === "register" ? "bg-white text-brand-700 shadow-card dark:bg-brand-600 dark:text-white" : "text-sub"
              }`}
            >
              Daftar
            </button>
          </div>

          <h2 className="text-2xl font-extrabold text-ink dark:text-white">
            {mode === "login" ? "Selamat datang kembali" : "Buat akun baru"}
          </h2>
          <p className="mt-1.5 text-[13px] text-sub">
            {mode === "login" ? "Masuk untuk melanjutkan ke RisetIn." : "Bergabung dan mulai jelajahi ekosistem riset & industri."}
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[12.5px] font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode === "register" && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "mahasiswa", label: "Mahasiswa", Icon: FlaskConical },
                    { key: "industri", label: "Industri", Icon: Building2 },
                  ].map(({ key, label, Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRole(key)}
                      className={`tap flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[12.5px] font-semibold ${
                        role === key
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-line bg-white text-sub"
                      }`}
                    >
                      <Icon size={14} /> {label}
                    </button>
                  ))}
                </div>
                <Field label="Nama lengkap / Nama perusahaan" icon={User}>
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama"
                    className="input pl-10 dark:bg-white/5 dark:border-white/10 dark:text-white"
                  />
                </Field>
              </>
            )}

            <Field label="Alamat email" icon={Mail}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="input pl-10 dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </Field>

            <Field label="Kata sandi" icon={Lock}>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="input pl-10 pr-10 dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-[34px] text-brand-300 hover:text-brand-500"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="tap group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-[13.5px] font-bold text-white shadow-soft transition-colors hover:bg-brand-700 disabled:opacity-70"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  {mode === "login" ? "Masuk" : "Daftar"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => demoLogin("mahasiswa")}
              className="tap flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white py-2.5 text-[12.5px] font-bold text-brand-700"
            >
              <FlaskConical size={14} /> Demo Mahasiswa
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => demoLogin("industri")}
              className="tap flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white py-2.5 text-[12.5px] font-bold text-brand-700"
            >
              <Building2 size={14} /> Demo Industri
            </button>
          </div>

          <p className="mt-3 text-center text-[12px] text-sub">
            Mode demo: gunakan tombol cepat di atas, atau isi email bebas (berisi <b>"industri"</b> → akun Industri).
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="relative">
      <label className="mb-1.5 block text-[12.5px] font-semibold text-ink dark:text-white/80">{label}</label>
      <Icon size={16} className="pointer-events-none absolute left-3 top-[34px] text-brand-300" />
      {children}
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[13px] font-bold text-white">{title}</p>
        <p className="text-[11.5px] text-white/65">{desc}</p>
      </div>
    </div>
  );
}
