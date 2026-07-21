import React, { useState } from "react";
import { Camera } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Container from "../components/Container";
import { useApp } from "../context/AppContext";

export default function EditProfil() {
  const { user, showToast } = useApp();
  const [nama, setNama] = useState(user.nama);
  const [email, setEmail] = useState(user.email);
  const [telp, setTelp] = useState("");
  const [bio, setBio] = useState(user.bio);

  return (
    <Container>
      <PageHeader title="Edit Profil" back />

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
            {user.inisial}
            <button className="tap absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-600 shadow-card ring-1 ring-line">
              <Camera size={13} />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama lengkap">
              <input value={nama} onChange={(e) => setNama(e.target.value)} className="input" />
            </Field>
            <Field label="Alamat email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Nomor telepon">
            <input value={telp} onChange={(e) => setTelp(e.target.value)} placeholder="+62 8xxxxxxxx" className="input sm:max-w-xs" />
          </Field>
          <Field label="Bio">
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="input resize-none" />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => showToast("Perubahan disimpan")}
            className="tap rounded-xl bg-brand-600 px-6 py-3 text-[13px] font-bold text-white"
          >
            Simpan perubahan
          </button>
        </div>
      </div>
    </Container>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</label>
      {children}
    </div>
  );
}
