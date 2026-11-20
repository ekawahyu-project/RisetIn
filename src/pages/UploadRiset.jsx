import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, Trash2, Image, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { categories } from "../data/mockData";
import RisetThumb from "../components/RisetThumb";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";

const steps = ["Informasi", "Dokumen", "Publikasi"];

export default function UploadRiset() {
  const navigate = useNavigate();
  const { addRiset, user, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    judul: "",
    institusi: user.kampus || "",
    kategori: "",
    tahap: "",
    deskripsi: "",
    manfaatText: "",
    lisensi: "CC BY-SA",
    fileName: "",
    docFile: null,
    imgFile: null,
    imgPreviewUrl: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (form.imgPreviewUrl) URL.revokeObjectURL(form.imgPreviewUrl);
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imgFile: file, imgPreviewUrl: url }));
  };

  const removeImage = () => {
    if (form.imgPreviewUrl) URL.revokeObjectURL(form.imgPreviewUrl);
    setForm((f) => ({ ...f, imgFile: null, imgPreviewUrl: null }));
  };

  const manfaatList = form.manfaatText
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  const publish = async () => {
    if (form.judul.trim().length < 3) {
      showToast("Judul riset minimal 3 karakter");
      setStep(1);
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("judul", form.judul.trim());
      fd.append("kampus", (form.institusi || user.kampus || "Universitas Brawijaya").trim());
      fd.append("kategori", form.kategori || "teknologi");
      fd.append("tahap", form.tahap || "Gagasan murni");
      fd.append("lisensi", form.lisensi || "CC BY-SA");
      fd.append("ringkasan", form.deskripsi.trim() || "Belum ada deskripsi lengkap untuk riset ini.");
      fd.append("status", "diterbitkan");
      if (manfaatList.length > 0) {
        fd.append("manfaat", JSON.stringify(manfaatList));
      }
      if (form.imgFile) fd.append("cover", form.imgFile);
      if (form.docFile) fd.append("dokumen", form.docFile);

      await addRiset(fd);
      setPublished(true);
    } catch (err) {
      showToast(err.message || "Gagal menerbitkan riset");
    } finally {
      setSubmitting(false);
    }
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
            <p className="mt-1 text-[13px] text-sub">Riset berhasil diterbitkan dan dapat ditemukan di Jelajahi Riset.</p>
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
    <Container wide>
      <PageHeader title="Upload Riset" back subtitle="Bagikan riset Anda dan jangkau industri yang tepat" />

      <div className="w-full">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-[#101f2e] p-4 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 sm:gap-3">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[12.5px] font-bold transition-all ${
                    i + 1 < step
                      ? "bg-brand-600 text-white"
                      : i + 1 === step
                      ? "bg-brand-600 text-white ring-4 ring-brand-600/20"
                      : "bg-sky-100 dark:bg-white/5 text-brand-400"
                  }`}
                >
                  {i + 1 < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-[10.5px] font-medium ${i + 1 <= step ? "text-brand-700 dark:text-brand-300" : "text-sub"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 rounded sm:w-14 transition-colors ${i + 1 < step ? "bg-brand-600" : "bg-sky-100 dark:bg-white/5"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white dark:bg-[#101f2e] p-6 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-8">
          {/* ========== STEP 1: Informasi ========== */}
          {step === 1 && (
            <div className="fade-up space-y-5">
              <h2 className="text-[16px] font-bold text-ink dark:text-white">Informasi Riset</h2>

              <Field label="Judul Riset">
                <input
                  value={form.judul}
                  onChange={(e) => set("judul", e.target.value)}
                  placeholder="Masukkan judul riset"
                  className="input"
                />
              </Field>

              <Field label="Institusi / Universitas">
                <input
                  value={form.institusi}
                  onChange={(e) => set("institusi", e.target.value)}
                  placeholder="Contoh: Universitas Brawijaya"
                  className="input"
                />
              </Field>

              {/* Cover Image Upload */}
              <Field label="Gambar Cover Riset">
                {form.imgPreviewUrl ? (
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={form.imgPreviewUrl}
                      alt="Cover riset"
                      className="h-44 w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="tap flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[12px] font-bold text-red-600 hover:bg-white"
                      >
                        <Trash2 size={13} /> Hapus Gambar
                      </button>
                    </div>
                    {/* Remove button always visible */}
                    <button
                      type="button"
                      onClick={removeImage}
                      className="tap absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 dark:border-white/10 bg-sky-50 dark:bg-white/5 py-8 text-center transition-colors hover:border-brand-400 hover:bg-sky-100 dark:hover:bg-white/8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 dark:bg-white/10 text-brand-500">
                      <Image size={22} />
                    </div>
                    <p className="text-[13px] font-semibold text-ink dark:text-white">Klik untuk upload gambar cover</p>
                    <p className="text-[11.5px] text-sub">JPG, PNG, WebP — Maks. 5MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
                <p className="mt-1.5 text-[11.5px] text-sub">
                  Gambar cover membantu riset Anda tampil lebih menarik di Jelajahi Riset.
                </p>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bidang Riset">
                  <select value={form.kategori} onChange={(e) => set("kategori", e.target.value)} className="input">
                    <option value="">Pilih bidang riset</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
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

              <Field label="Manfaat Utama (1 baris per poin)">
                <textarea
                  value={form.manfaatText}
                  onChange={(e) => set("manfaatText", e.target.value)}
                  placeholder={"Contoh:\nHemat biaya operasional hingga 30%\nMonitoring real-time dari smartphone"}
                  rows={3}
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

          {/* ========== STEP 2: Dokumen ========== */}
          {step === 2 && (
            <div className="fade-up space-y-4">
              <h2 className="text-[15px] font-bold text-ink dark:text-white">Dokumen</h2>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-sky-50 dark:bg-white/5 py-12 text-center transition-colors hover:border-brand-400">
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
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.xlsx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setForm((prev) => ({ ...prev, docFile: f, fileName: f.name }));
                  }}
                />
              </label>
              {form.fileName && (
                <div className="flex items-center justify-between rounded-xl bg-sky-50 dark:bg-white/5 p-3.5">
                  <span className="truncate text-[13px] text-ink dark:text-white">{form.fileName}</span>
                  <button onClick={() => setForm((prev) => ({ ...prev, docFile: null, fileName: "" }))} className="tap text-berry">
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========== STEP 3: Publikasi ========== */}
          {step === 3 && (
            <div className="fade-up space-y-4">
              <h2 className="text-[15px] font-bold text-ink dark:text-white">Pratinjau Publikasi</h2>
              <div className="rounded-2xl bg-sky-50 dark:bg-white/5 p-4">
                {/* Cover image preview */}
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "16/9" }}>
                  {form.imgPreviewUrl ? (
                    <img
                      src={form.imgPreviewUrl}
                      alt="Cover riset"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <RisetThumb
                      img="lms"
                      kategori={form.kategori || "teknologi"}
                      className="h-full w-full"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <p className="mt-3 text-[15px] font-bold text-ink dark:text-white">{form.judul || "Judul Riset Anda"}</p>
                <p className="text-[12px] text-sub">{form.institusi || user.kampus || "Universitas Brawijaya"}</p>
                <p className="mt-2 w-fit rounded-full bg-white dark:bg-[#101f2e] px-2.5 py-0.5 text-[11.5px] font-semibold text-brand-600 ring-1 ring-line dark:ring-white/10">
                  Lisensi: {form.lisensi}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/80 dark:text-white/75">
                  {form.deskripsi || "Belum ada deskripsi lengkap untuk riset ini."}
                </p>
                <p className="mt-3 text-[13px] font-bold text-ink dark:text-white">Manfaat</p>
                <ul className="mt-1 list-disc pl-4 text-[13px] text-ink/80 dark:text-white/75">
                  {(manfaatList.length > 0 ? manfaatList : ["Manfaat riset akan dilengkapi oleh tim peneliti"]).map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => Math.max(s - 1, 1))}
                className="tap rounded-xl bg-sky-100 dark:bg-white/5 px-5 py-3 text-[13px] font-bold text-brand-700 dark:text-brand-300 transition-colors hover:bg-sky-200 dark:hover:bg-white/10"
              >
                Kembali
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => Math.min(s + 1, 3))}
                className="tap rounded-xl bg-brand-600 px-6 py-3 text-[13px] font-bold text-white hover:bg-brand-700 transition-colors"
              >
                Selanjutnya
              </button>
            ) : (
              <button
                onClick={publish}
                disabled={submitting}
                className="tap rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-[13px] font-bold text-white shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50 transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? "Menerbitkan..." : "Terbitkan Riset"}
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
