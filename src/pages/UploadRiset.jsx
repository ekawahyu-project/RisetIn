import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, Sparkles, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";
import RisetThumb from "../components/RisetThumb";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";

const steps = ["Informasi", "Dokumen", "Pengecekan", "Publikasi"];

export default function UploadRiset() {
  const navigate = useNavigate();
  const { addRiset, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    judul: "",
    kategori: "",
    tahap: "",
    deskripsi: "",
    lisensi: "CC BY-SA",
    fileName: "",
  });
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [published, setPublished] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const runCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setChecked(true);
    }, 1400);
  };

  const publish = () => {
    const kategori = form.kategori || "teknologi";
    addRiset({
      id: "r" + Date.now(),
      judul: form.judul || "Riset Tanpa Judul",
      kampus: "Universitas Brawijaya",
      kategori,
      lisensi: form.lisensi,
      views: 0,
      komentar: 0,
      suka: 0,
      diadopsi: 0,
      tahap: form.tahap || "Gagasan murni",
      status: "diterbitkan",
      img: "lms",
      ringkasan: form.deskripsi || "Belum ada deskripsi lengkap untuk riset ini.",
      manfaat: ["Manfaat akan dilengkapi peneliti"],
    });
    setPublished(true);
    showToast("Riset berhasil diterbitkan!");
  };

  if (published) {
    return (
      <Container>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-white dark:bg-[#101f2e] p-10 text-center shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-leaf/10 text-leaf">
            <CheckCircle2 size={30} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-ink dark:text-white">Berhasil!</p>
            <p className="mt-1 text-[13px] text-sub">Riset berhasil diterbitkan.</p>
          </div>
          <button
            onClick={() => navigate("/riset-saya")}
            className="tap w-full rounded-xl bg-brand-600 py-3 text-[13px] font-bold text-white"
          >
            Lihat Riset Saya
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader title="Upload Riset" back subtitle="Bagikan riset Anda dan jangkau industri yang tepat" />

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#101f2e] p-4 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 sm:gap-3">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[12.5px] font-bold ${
                    i + 1 <= step ? "bg-brand-600 text-white" : "bg-sky-100 dark:bg-white/5 text-brand-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-[10.5px] font-medium ${i + 1 <= step ? "text-brand-700" : "text-sub"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-8 rounded sm:w-14 ${i + 1 < step ? "bg-brand-600" : "bg-sky-100 dark:bg-white/5"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white dark:bg-[#101f2e] p-6 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-8">
          {step === 1 && (
            <div className="fade-up space-y-4">
              <h2 className="text-[15px] font-bold text-ink dark:text-white">Informasi Riset</h2>
              <Field label="Judul Riset">
                <input
                  value={form.judul}
                  onChange={(e) => set("judul", e.target.value)}
                  placeholder="Masukkan judul riset"
                  className="input"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bidang Riset">
                  <select value={form.kategori} onChange={(e) => set("kategori", e.target.value)} className="input">
                    <option value="">Pilih bidang riset</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Tahap Riset">
                  <select value={form.tahap} onChange={(e) => set("tahap", e.target.value)} className="input">
                    <option value="">Pilih tahap riset</option>
                    <option>Gagasan murni</option>
                    <option>Tinjauan literatur</option>
                    <option>Purwarupa fisik</option>
                  </select>
                </Field>
              </div>
              <Field label="Deskripsi Singkat">
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => set("deskripsi", e.target.value)}
                  placeholder="Jelaskan ringkasan riset Anda"
                  rows={4}
                  className="input resize-none"
                />
              </Field>
              <Field label="Lisensi">
                <select value={form.lisensi} onChange={(e) => set("lisensi", e.target.value)} className="input sm:max-w-xs">
                  <option>CC BY-SA</option>
                  <option>CC BY</option>
                  <option>All Rights Reserved</option>
                </select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="fade-up space-y-4">
              <h2 className="text-[15px] font-bold text-ink dark:text-white">Dokumen</h2>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-sky-50 dark:bg-white/5 py-12 text-center">
                <UploadCloud size={28} className="text-brand-400" />
                <p className="text-[13px] font-semibold text-ink dark:text-white">Klik untuk mengunggah, atau seret file ke sini</p>
                <p className="text-[11.5px] text-sub">Ukuran file maksimum 50MB</p>
                <div className="mt-1 flex gap-1.5">
                  {["PNG", "JPG", "PDF"].map((t) => (
                    <span key={t} className="rounded-md bg-white dark:bg-[#101f2e] px-2 py-0.5 text-[10.5px] font-semibold text-brand-600 ring-1 ring-line dark:ring-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => set("fileName", e.target.files?.[0]?.name || "dokumen-riset.pdf")}
                />
              </label>
              {form.fileName && (
                <div className="flex items-center justify-between rounded-xl bg-sky-50 dark:bg-white/5 p-3.5">
                  <span className="truncate text-[13px] text-ink dark:text-white">{form.fileName}</span>
                  <button onClick={() => set("fileName", "")} className="tap text-berry">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="fade-up space-y-4">
              <h2 className="text-[15px] font-bold text-ink dark:text-white">Pengecekan Otomatis</h2>
              <p className="text-[13px] leading-relaxed text-sub">
                Mesin AI RisetIn akan mengekstraksi metadata riset Anda (abstrak, teknologi inti, potensi aplikasi) secara otomatis.
              </p>
              <div className="rounded-2xl bg-sky-50 dark:bg-white/5 p-5">
                {!checking && !checked && (
                  <button
                    onClick={runCheck}
                    className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-[13px] font-bold text-white"
                  >
                    <Sparkles size={16} /> Jalankan Pengecekan AI
                  </button>
                )}
                {checking && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                    <p className="text-[13px] text-sub">Menganalisis dokumen riset...</p>
                  </div>
                )}
                {checked && (
                  <div className="fade-up space-y-2.5">
                    <CheckRow label="Abstrak terekstraksi" />
                    <CheckRow label="Teknologi inti teridentifikasi" />
                    <CheckRow label="Potensi aplikasi industri ditemukan" />
                    <CheckRow label="Bebas indikasi plagiarisme" />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="fade-up space-y-4">
              <h2 className="text-[15px] font-bold text-ink dark:text-white">Pratinjau Publikasi</h2>
              <div className="rounded-2xl bg-sky-50 dark:bg-white/5 p-4">
                <RisetThumb img="lms" kategori={form.kategori || "teknologi"} className="h-40 w-full rounded-xl" />
                <p className="mt-3 text-[15px] font-bold text-ink dark:text-white">{form.judul || "Judul Riset Anda"}</p>
                <p className="text-[12px] text-sub">Universitas Brawijaya</p>
                <p className="mt-2 w-fit rounded-full bg-white dark:bg-[#101f2e] px-2.5 py-0.5 text-[11.5px] font-semibold text-brand-600 ring-1 ring-line dark:ring-white/10">
                  Lisensi: {form.lisensi}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80 dark:text-white/75">
                  {form.deskripsi ||
                    "Sistem irigasi otomatis yang dapat memonitor kelembapan tanah dan cuaca secara real-time menggunakan sensor IoT untuk efisiensi penggunaan air."}
                </p>
                <p className="mt-3 text-[13px] font-bold text-ink dark:text-white">Manfaat</p>
                <ul className="mt-1 list-disc pl-4 text-[13px] text-ink/80 dark:text-white/75">
                  <li>Meningkatkan hasil panen</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => Math.max(s - 1, 1))}
                className="tap rounded-xl bg-sky-100 dark:bg-white/5 px-5 py-3 text-[13px] font-bold text-brand-700"
              >
                Kembali
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => Math.min(s + 1, 4))}
                disabled={step === 3 && !checked}
                className={`tap rounded-xl px-6 py-3 text-[13px] font-bold text-white ${
                  step === 3 && !checked ? "bg-brand-300" : "bg-brand-600"
                }`}
              >
                Selanjutnya
              </button>
            ) : (
              <button onClick={publish} className="tap rounded-xl bg-brand-600 px-6 py-3 text-[13px] font-bold text-white">
                Terbitkan
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink dark:text-white">{label}</label>
      {children}
    </div>
  );
}

function CheckRow({ label }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-ink dark:text-white">
      <CheckCircle2 size={16} className="text-leaf" />
      {label}
    </div>
  );
}
