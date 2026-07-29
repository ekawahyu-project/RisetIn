import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, UserPen, Settings, Sun, Moon, PartyPopper, Info, MessageCircle, HandHeart, LogOut, X } from "lucide-react";
import { useApp } from "../context/AppContext";

const iconFor = {
  success: { Icon: PartyPopper, cls: "bg-leaf/10 text-leaf" },
  info: { Icon: Info, cls: "bg-brand-500/10 text-brand-600" },
  chat: { Icon: MessageCircle, cls: "bg-gold/10 text-gold" },
  request: { Icon: HandHeart, cls: "bg-berry/10 text-berry" },
};

// Reusable Logout Confirmation Modal
function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box relative w-full max-w-sm rounded-3xl bg-white dark:bg-[#0d1e2e] shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-500 via-rose-400 to-red-600" />
        <div className="relative p-8">
          <button
            onClick={onCancel}
            className="tap absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 dark:bg-white/10 text-sub hover:text-ink dark:hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 ring-1 ring-red-200 dark:ring-red-500/20">
            <LogOut size={28} className="text-red-500" />
          </div>
          <h2 className="text-center text-[18px] font-extrabold text-ink dark:text-white tracking-tight">
            Keluar dari RisetIn?
          </h2>
          <p className="mt-2 text-center text-[13.5px] text-sub leading-relaxed">
            Anda akan keluar dari sesi ini. Anda bisa masuk kembali kapan saja.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="tap flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-3.5 text-[14px] font-bold text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-red-500/40"
            >
              <LogOut size={16} />
              Keluar
            </button>
            <button
              onClick={onCancel}
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

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, notifications, unreadCount, markAllRead, logout } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellShake, setBellShake] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      setBellShake(true);
      const t = setTimeout(() => setBellShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [unreadCount]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white/80 px-4 backdrop-blur-md dark:border-white/10 dark:bg-[#0b1420]/80 sm:px-6">
        <button
          onClick={onMenuClick}
          className="tap flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-sky-100 dark:text-white dark:hover:bg-white/10 lg:hidden transition-colors"
        >
          <Menu size={19} />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <img src="/logo-risetin.png" alt="RisetIn" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-[14px] font-extrabold text-ink dark:text-white">RisetIn</span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="tap relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-brand-700 dark:bg-white/10 dark:text-brand-200 transition-colors hover:bg-sky-200 dark:hover:bg-white/15"
            >
              <span className={bellShake ? "ring-bell inline-flex" : "inline-flex"}>
                <Bell size={16} />
              </span>
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-berry ring-2 ring-white dark:ring-[#0b1420]" />
              )}
            </button>
            {notifOpen && (
              <div className="fade-up absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-white shadow-soft dark:border-white/10 dark:bg-[#101f2e]">
                <div className="flex items-center justify-between border-b border-line px-4 py-3 dark:border-white/10">
                  <p className="text-[13px] font-bold text-ink dark:text-white">Notifikasi</p>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] font-semibold text-brand-600 dark:text-brand-300 hover:underline">
                      Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="no-scrollbar max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => {
                    const { Icon, cls } = iconFor[n.type] || iconFor.info;
                    return (
                      <div key={n.id} className="flex gap-2.5 border-b border-line/60 px-4 py-3 last:border-0 dark:border-white/5">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                          <Icon size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-semibold text-ink dark:text-white">{n.title}</p>
                          <p className="line-clamp-2 text-[11px] text-sub">{n.body}</p>
                        </div>
                        {n.unread && <span className="ml-auto mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-berry" />}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => { navigate("/notifikasi"); setNotifOpen(false); }}
                  className="tap block w-full bg-sky-50 py-2.5 text-center text-[12px] font-semibold text-brand-600 dark:bg-white/5 dark:text-brand-300 hover:bg-sky-100 dark:hover:bg-white/10 transition-colors"
                >
                  Lihat semua notifikasi
                </button>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              className="tap flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-sky-50 dark:hover:bg-white/10 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11px] font-bold text-white shadow-md shadow-brand-600/30">
                {user.inisial}
              </div>
              <ChevronDown size={14} className={`hidden text-sub sm:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="fade-up absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-soft dark:border-white/10 dark:bg-[#101f2e]">
                <div className="border-b border-line px-4 py-2.5 dark:border-white/10">
                  <p className="truncate text-[12.5px] font-bold text-ink dark:text-white">{user.nama}</p>
                  <p className="truncate text-[11px] text-sub">{user.role}</p>
                </div>
                <MenuItem
                  icon={UserPen}
                  label="Edit Profil"
                  onClick={() => { navigate("/profil/edit"); setProfileOpen(false); }}
                />
                <MenuItem
                  icon={Settings}
                  label="Pengaturan"
                  onClick={() => { navigate("/pengaturan"); setProfileOpen(false); }}
                />
                <div className="mx-2 my-1 h-px bg-line dark:bg-white/10" />
                <button
                  onClick={() => { setProfileOpen(false); setShowLogoutModal(true); }}
                  className="tap flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12.5px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setShowLogoutModal(false); logout(); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="tap flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12.5px] font-medium text-ink hover:bg-sky-50 dark:text-white/90 dark:hover:bg-white/10 transition-colors"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}
