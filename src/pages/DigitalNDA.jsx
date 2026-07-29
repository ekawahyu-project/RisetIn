import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, Shield, CheckCircle2, Copy, Calendar,
  User, Briefcase, Pen, RotateCcw, AlertCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

const ndaPoints = [
  "Informasi, dokumen, dan data dalam proposal riset bersifat rahasia.",
  "Pihak penerima dilarang mengungkapkan atau mendistribusikan kepada pihak ketiga tanpa izin tertulis.",
  "Hak Kekayaan Intelektual (HKI) atas riset tetap milik peneliti sampai ada perjanjian lanjutan.",
  "Informasi hanya boleh digunakan untuk evaluasi dan penjajakan kerja sama.",
  "Pelanggaran terhadap perjanjian ini dapat dikenakan sanksi sesuai hukum yang berlaku.",
];

/* ── Signature Canvas ── */
function SignatureCanvas({ onSign }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const lastPos = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1e40af";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    if (!hasSigned) setHasSigned(true);
    onSign(canvas.toDataURL());
  };

  const stopDraw = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    onSign(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="h-36 w-full cursor-crosshair rounded-xl border-2 border-dashed border-brand-300 dark:border-white/20 bg-white dark:bg-white/5 touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      {!hasSigned && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Pen size={22} className="text-brand-300 dark:text-white/25" />
          <p className="text-[12px] text-sub dark:text-white/40">Tanda tangan di sini</p>
        </div>
      )}
      {hasSigned && (
        <button
          type="button"
          onClick={clear}
          className="tap absolute right-2 top-2 flex items-center gap-1.5 rounded-lg bg-white dark:bg-[#0d1e2e] px-2.5 py-1.5 text-[11px] font-semibold text-sub dark:text-white/60 shadow-sm ring-1 ring-black/5 dark:ring-white/10"
        >
          <RotateCcw size={11} /> Ulangi
        </button>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function DigitalNDA() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useApp();
  const isMahasiswa = role === "mahasiswa";

  const [step, setStep] = useState(isMahasiswa ? 3 : 1);
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState(null);
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const nomorNDA = `NDA-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}-001`;
  const tanggal =
    today.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";

  const copyNomor = () => {
    navigator.clipboard.writeText(nomorNDA).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const canConfirm = signature && nama.trim() && jabatan.trim();

  return (
    <Container wide>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => (step === 1 || isMahasiswa ? navigate(-1) : setStep((s) => s - 1))}
            className="tap flex h-9 w-9 items-center justify-center rounded-full text-ink dark:text-white hover:bg-sky-100 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-[18px] font-extrabold text-ink dark:text-white">Digital NDA</h1>
            <p className="text-[12px] text-sub">
              {step === 1
                ? "Ringkasan Perjanjian"
                : step === 2
                ? "Tanda Tangan Perjanjian"
                : "Perjanjian Berhasil Ditandatangani"}
            </p>
          </div>

          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? "w-6 bg-brand-600"
                    : s < step
                    ? "w-2 bg-brand-300"
                    : "w-2 bg-gray-200 dark:bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── STEP 1: Ringkasan ── */}
        {step === 1 && (
          <div className="fade-up space-y-4">
            <div className="rounded-2xl bg-white dark:bg-[#101f2e] p-6 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/20">
                  <Shield size={18} className="text-brand-600 dark:text-brand-300" />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-ink dark:text-white">Ringkasan Perjanjian</h2>
                  <p className="text-[12px] text-sub">Non-Disclosure Agreement (NDA)</p>
                </div>
              </div>

              <ul className="space-y-3">
                {ndaPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/20 text-[10px] font-bold text-brand-600 dark:text-brand-300">
                      {i + 1}
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-700 dark:text-white/80">{point}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-3 flex gap-2.5">
                <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="text-[12px] text-amber-700 dark:text-amber-300 leading-relaxed">
                  Perjanjian ini bersifat mengikat secara hukum. Pastikan Anda membaca seluruh ketentuan sebelum menyetujui.
                </p>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-sky-50 dark:bg-white/5 p-4 ring-1 ring-transparent has-[:checked]:ring-brand-300 dark:has-[:checked]:ring-brand-500/50 transition-all">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                />
                <p className="text-[12.5px] leading-relaxed text-gray-700 dark:text-white/80">
                  Saya telah membaca dan memahami seluruh isi perjanjian di atas dan setuju untuk menjaga kerahasiaan informasi riset tersebut.
                </p>
              </label>
            </div>

            <button
              disabled={!agreed}
              onClick={() => setStep(2)}
              className="tap w-full rounded-xl bg-brand-600 py-3.5 text-[14px] font-bold text-white shadow-soft transition-all hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Setuju &amp; Lanjut ke Tanda Tangan
            </button>
          </div>
        )}

        {/* ── STEP 2: Tanda Tangan ── */}
        {step === 2 && (
          <div className="fade-up">
            <div className="rounded-2xl bg-white dark:bg-[#101f2e] p-6 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 space-y-5">
              <div>
                <label className="mb-2 block text-[12.5px] font-semibold text-ink dark:text-white">
                  Tanda Tangan Digital
                </label>
                <SignatureCanvas onSign={setSignature} />
                <p className="mt-1.5 text-[11.5px] text-sub">Gunakan mouse atau jari untuk menandatangani di area di atas.</p>
              </div>

              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-ink dark:text-white">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                  <input
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="input !pl-[42px]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-ink dark:text-white">
                  Jabatan
                </label>
                <div className="relative">
                  <Briefcase size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-400" />
                  <input
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Contoh: VP Research &amp; Development"
                    className="input !pl-[42px]"
                  />
                </div>
              </div>

              <button
                disabled={!canConfirm}
                onClick={() => setStep(3)}
                className="tap w-full rounded-xl bg-brand-600 py-3.5 text-[14px] font-bold text-white shadow-soft transition-all hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Konfirmasi &amp; Tandatangani NDA
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Sukses ── */}
        {step === 3 && (
          <div className="fade-up">
            <div className="rounded-2xl bg-white dark:bg-[#101f2e] p-6 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 space-y-5">
              {/* Success header */}
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex h-18 w-18 items-center justify-center rounded-full bg-sky-100 dark:bg-white/10 ring-4 ring-sky-50 dark:ring-white/5 p-4">
                  <CheckCircle2 size={32} className="text-brand-600 dark:text-brand-300" />
                </div>
                <h2 className="text-[18px] font-extrabold text-ink dark:text-white text-center">
                  NDA Berhasil Ditandatangani!
                </h2>
              </div>

              {/* NDA Info */}
              <div className="rounded-xl bg-sky-50 dark:bg-white/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-widest text-sub">Nomor Perjanjian</p>
                    <p className="mt-0.5 font-mono text-[13.5px] font-bold text-ink dark:text-white">{nomorNDA}</p>
                  </div>
                  <button
                    onClick={copyNomor}
                    className="tap flex items-center gap-1.5 rounded-lg bg-white dark:bg-white/10 px-3 py-2 text-[11.5px] font-semibold text-brand-600 dark:text-brand-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-colors hover:bg-sky-50"
                  >
                    <Copy size={12} /> {copied ? "Disalin!" : "Salin"}
                  </button>
                </div>

                <div className="h-px bg-line dark:bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-widest text-sub">Tanggal Ditandatangani</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-ink dark:text-white">{tanggal}</p>
                  </div>
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-white dark:bg-white/10 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                    <Calendar size={14} className="text-brand-600 dark:text-brand-300" />
                  </div>
                </div>
              </div>

              {/* Signature preview */}
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-widest text-sub">Tanda Tangan</p>
                  {isMahasiswa ? (
                    <div className="rounded-xl border border-line dark:border-white/10 bg-white dark:bg-white/5 p-3 flex items-center justify-center min-h-[5rem]">
                      <span className="font-['Caveat',cursive] text-3xl font-bold text-blue-900 rotate-[-5deg]">PT Agro Makmur</span>
                    </div>
                  ) : signature ? (
                    <div className="rounded-xl border border-line dark:border-white/10 bg-white dark:bg-white/5 p-3">
                      <img src={signature} alt="Tanda tangan" className="h-16 w-full object-contain" />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-line dark:border-white/10 bg-white/50 dark:bg-white/5 p-3 min-h-[5rem]" />
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-widest text-sub">Nama Lengkap</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <User size={14} className="shrink-0 text-brand-400" />
                      <p className="text-[13.5px] font-semibold text-ink dark:text-white">{isMahasiswa ? "Direktur PT Agro Makmur" : nama}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-widest text-sub">Jabatan</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Briefcase size={14} className="shrink-0 text-brand-400" />
                      <p className="text-[13.5px] font-semibold text-ink dark:text-white">{isMahasiswa ? "CEO & Founder" : jabatan}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/kolaborasi")}
                className="tap w-full rounded-xl bg-brand-600 py-3.5 text-[14px] font-bold text-white shadow-soft hover:bg-brand-700 transition-colors"
              >
                Kembali ke Kolaborasi
              </button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
