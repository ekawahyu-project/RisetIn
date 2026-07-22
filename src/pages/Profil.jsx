import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPen, History, Settings, LogOut, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";

export default function Profil() {
  const { user, role, logout } = useApp();
  const navigate = useNavigate();

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
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white shadow-soft">
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
                className="tap flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-sky-50 dark:hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 dark:bg-white/5 text-brand-600">
                  <it.icon size={18} />
                </div>
                <span className="flex-1 text-[13.5px] font-semibold text-ink dark:text-white">{it.label}</span>
                <ChevronRight size={16} className="text-brand-300" />
              </button>
            ))}

            <button
              onClick={logout}
              className="tap flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-left hover:bg-berry/5 dark:hover:bg-berry/10"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-berry/10 text-berry">
                <LogOut size={18} />
              </div>
              <span className="flex-1 text-[13.5px] font-semibold text-berry">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
