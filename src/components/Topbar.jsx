import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, UserPen, Settings, LogOut, PartyPopper, Info, MessageCircle, HandHeart } from "lucide-react";
import { useApp } from "../context/AppContext";

const iconFor = {
  success: { Icon: PartyPopper, cls: "bg-leaf/10 text-leaf" },
  info: { Icon: Info, cls: "bg-brand-500/10 text-brand-600" },
  chat: { Icon: MessageCircle, cls: "bg-gold/10 text-gold" },
  request: { Icon: HandHeart, cls: "bg-berry/10 text-berry" },
};

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, notifications, unreadCount, markAllRead } = useApp();
  const [q, setQ] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
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

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/riset?q=${encodeURIComponent(q.trim())}` : "/riset");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="tap flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-sky-100 lg:hidden"
      >
        <Menu size={19} />
      </button>

      <form onSubmit={submitSearch} className="flex max-w-md flex-1 items-center gap-2 rounded-xl bg-sky-100 px-3 py-2">
        <Search size={16} className="shrink-0 text-brand-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari riset, kampus, atau bidang..."
          className="w-full bg-transparent text-[13px] text-ink placeholder:text-brand-300 focus:outline-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="tap relative flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-brand-700"
          >
            <Bell size={16} />
            {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-berry ring-2 ring-white" />}
          </button>
          {notifOpen && (
            <div className="fade-up absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <p className="text-[13px] font-bold text-ink">Notifikasi</p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] font-semibold text-brand-600">
                    Tandai dibaca
                  </button>
                )}
              </div>
              <div className="no-scrollbar max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => {
                  const { Icon, cls } = iconFor[n.type] || iconFor.info;
                  return (
                    <div key={n.id} className="flex gap-2.5 border-b border-line/60 px-4 py-3 last:border-0">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cls}`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-ink">{n.title}</p>
                        <p className="line-clamp-2 text-[11px] text-sub">{n.body}</p>
                      </div>
                      {n.unread && <span className="ml-auto mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-berry" />}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  navigate("/notifikasi");
                  setNotifOpen(false);
                }}
                className="tap block w-full bg-sky-50 py-2.5 text-center text-[12px] font-semibold text-brand-600"
              >
                Lihat semua notifikasi
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen((v) => !v)} className="tap flex items-center gap-2 rounded-full hover:bg-sky-50 p-1 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
              {user.inisial}
            </div>
            <ChevronDown size={14} className="hidden text-sub sm:block" />
          </button>
          {profileOpen && (
            <div className="fade-up absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-soft">
              <div className="border-b border-line px-4 py-2.5">
                <p className="truncate text-[12.5px] font-bold text-ink">{user.nama}</p>
                <p className="truncate text-[11px] text-sub">{user.role}</p>
              </div>
              <MenuItem icon={UserPen} label="Edit Profil" onClick={() => { navigate("/profil/edit"); setProfileOpen(false); }} />
              <MenuItem icon={Settings} label="Pengaturan" onClick={() => { navigate("/pengaturan"); setProfileOpen(false); }} />
              <MenuItem icon={LogOut} label="Keluar" danger onClick={() => setProfileOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`tap flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[12.5px] font-medium hover:bg-sky-50 ${
        danger ? "text-berry" : "text-ink"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}
