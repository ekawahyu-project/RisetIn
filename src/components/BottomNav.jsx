import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Search, Plus, Users, User, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BottomNav() {
  const { role } = useApp();

  const items =
    role === "mahasiswa"
      ? [
          { to: "/", icon: Home, label: "Beranda", end: true },
          { to: "/riset", icon: Search, label: "Riset" },
          { to: "/upload", icon: Plus, label: "", isFab: true },
          { to: "/kolaborasi", icon: Users, label: "Kolaborasi" },
          { to: "/profil", icon: User, label: "Profil" },
        ]
      : [
          { to: "/", icon: Home, label: "Beranda", end: true },
          { to: "/riset", icon: Search, label: "Riset" },
          { to: "/matchmaking", icon: Sparkles, label: "", isFab: true },
          { to: "/kolaborasi", icon: Users, label: "Kolaborasi" },
          { to: "/profil", icon: User, label: "Profil" },
        ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-end justify-between border-t border-line bg-white/95 px-4 pb-2 pt-1.5 backdrop-blur lg:hidden">
      {items.map((it) =>
        it.isFab ? (
          <NavLink key={it.to} to={it.to} className="relative -mt-6 flex flex-col items-center">
            <span className="tap flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
              <it.icon size={22} strokeWidth={2.4} />
            </span>
          </NavLink>
        ) : (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `tap flex flex-col items-center gap-0.5 px-2 py-1.5 text-[10.5px] font-medium ${
                isActive ? "text-brand-600" : "text-sub"
              }`
            }
          >
            <it.icon size={20} strokeWidth={2.2} />
            {it.label}
          </NavLink>
        )
      )}
    </nav>
  );
}
