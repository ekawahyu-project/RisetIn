import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPen, History, Settings, LogOut, ChevronRight, AlertTriangle, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

// Logout Confirmation Modal
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1e2e] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-400 to-red-600" />

        <div className="p-8">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 ring-1 ring-red-200 dark:ring-red-500/20">
            <LogOut size={28} className="text-red-500" />
          </div>

          {/* Content */}
          <h2 className="text-center text-[18px] font-extrabold text-ink dark:text-white tracking-tight">
            Keluar dari RisetIn?
          </h2>
          <p className="mt-2 text-center text-[13.5px] text-sub leading-relaxed">
            Anda akan keluar dari sesi ini. Anda bisa masuk kembali kapan saja.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              id="logout-confirm-btn"
              className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-97"
            >
              <LogOut size={16} />
              Keluar
            </button>
            <button
              onClick={onCancel}
              id="logout-cancel-btn"
              className="tap flex w-full items-center justify-center rounded-xl bg-sky-50 dark:bg-white/5 py-3.5 text-[14px] font-semibold text-ink dark:text-white/80 transition-all hover:bg-sky-100 dark:hover:bg-white/10"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profil() {
  const { user, role, logout } = useApp();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const items = [
    { icon: UserPen, label: "Edit Profil", to: "/profil/edit" },
    { icon: History, label: "Riwayat Aktivitas", to: "/profil" },
    { icon: Settings, label: "Pengaturan", to: "/pengaturan" },
  ];

  return (
    <Container wide>
      <PageHeader title="Profil" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white dark:bg-[#101f2e] p-6 text-center shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg shadow-brand-600/30">
              {user.inisial}
            </div>
            <h1 className="mt-4 text-[16px] font-extrabold text-ink dark:text-white">{user.nama}</h1>
            <span className="mt-1.5 inline-block rounded-full bg-brand-600/10 px-2.5 py-0.5 text-[11.5px] font-semibold text-brand-700 dark:bg-white/10 dark:text-brand-200">
              {user.role}
            </span>
            <p className="mt-1.5 text-[12.5px] text-sub">{role === "mahasiswa" ? user.kampus : user.sektor}</p>
            <p className="mx-auto mt-3 max-w-xs text-[12.5px] leading-relaxed text-sub">{user.bio}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {Object.entries(user.stats).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white dark:bg-[#101f2e] p-4 text-center shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5">
                <p className="text-[18px] font-extrabold text-ink dark:text-white">{v}</p>
                <p className="text-[11px] capitalize text-sub">{k}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white dark:bg-[#101f2e] p-3 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/5 sm:p-4">
            {items.map((it) => (
              <button
                key={it.label}
                onClick={() => navigate(it.to)}
                className="tap flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-sky-50 dark:hover:bg-white/10 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-white/5 text-brand-600">
                  <it.icon size={18} />
                </div>
                <span className="flex-1 text-[13.5px] font-semibold text-ink dark:text-white">{it.label}</span>
                <ChevronRight size={16} className="text-brand-300" />
              </button>
            ))}

            {/* Divider */}
            <div className="my-2 h-px bg-line dark:bg-white/5" />

            {/* Logout button */}
            <button
              id="logout-btn"
              onClick={() => setShowLogoutModal(true)}
              className="tap flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
                <LogOut size={18} />
              </div>
              <span className="flex-1 text-[13.5px] font-semibold text-red-500">Keluar</span>
              <ChevronRight size={16} className="text-red-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            logout();
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </Container>
  );
}
