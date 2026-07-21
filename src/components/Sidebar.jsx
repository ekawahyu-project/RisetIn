import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Search, Users, User, Sparkles, UploadCloud, FlaskConical, ArrowLeftRight, LogOut } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Sidebar({ onNavigate }) {
  const { role, setRole, user, showToast } = useApp();
  const navigate = useNavigate();

  const navItems =
    role === "mahasiswa"
      ? [
          { to: "/", icon: Home, label: "Beranda", end: true },
          { to: "/riset", icon: Search, label: "Jelajahi Riset" },
          { to: "/riset-saya", icon: FlaskConical, label: "Riset Saya" },
          { to: "/kolaborasi", icon: Users, label: "Kolaborasi" },
        ]
      : [
          { to: "/", icon: Home, label: "Beranda", end: true },
          { to: "/riset", icon: Search, label: "Jelajahi Riset" },
          { to: "/matchmaking", icon: Sparkles, label: "Matchmaking AI" },
          { to: "/kolaborasi", icon: Users, label: "Kolaborasi" },
        ];

  return (
    <aside className="flex h-full w-full flex-col bg-brand-800 text-white">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-lg font-black">R</div>
        <div>
          <p className="text-[16px] font-extrabold leading-none">RisetIn</p>
          <p className="text-[10.5px] text-white/50">Riset × Industri</p>
        </div>
      </div>

      {role === "mahasiswa" ? (
        <button
          onClick={() => {
            navigate("/upload");
            onNavigate?.();
          }}
          className="tap mx-4 mb-2 flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[13px] font-bold text-brand-700 shadow-soft"
        >
          <UploadCloud size={16} /> Upload Riset
        </button>
      ) : (
        <button
          onClick={() => {
            navigate("/matchmaking");
            onNavigate?.();
          }}
          className="tap mx-4 mb-2 flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-[13px] font-bold text-brand-700 shadow-soft"
        >
          <Sparkles size={16} /> Matchmaking AI
        </button>
      )}

      <nav className="mt-3 flex-1 space-y-1 px-3">
        {navItems.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
                isActive ? "bg-white/15 text-white" : "text-white/65 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <it.icon size={18} />
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-2 border-t border-white/10 pt-3">
        <button
          onClick={() => {
            setRole(role === "mahasiswa" ? "industri" : "mahasiswa");
            navigate("/");
            showToast(`Beralih ke mode ${role === "mahasiswa" ? "Industri" : "Mahasiswa"}`);
            onNavigate?.();
          }}
          className="tap flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12.5px] font-medium text-white/65 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeftRight size={16} />
          Mode {role === "mahasiswa" ? "Industri" : "Mahasiswa"}
        </button>
      </div>

      <button
        onClick={() => {
          navigate("/profil");
          onNavigate?.();
        }}
        className="tap m-3 mt-0 flex items-center gap-3 rounded-xl bg-white/5 p-3 text-left hover:bg-white/10"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-400 text-[11px] font-bold text-white">
          {user.inisial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-semibold text-white">{user.nama}</p>
          <p className="truncate text-[10.5px] text-white/50">{user.role}</p>
        </div>
        <LogOut size={15} className="shrink-0 text-white/40" />
      </button>
    </aside>
  );
}
