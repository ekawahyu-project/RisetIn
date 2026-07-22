import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import BottomNav from "./components/BottomNav";
import { useApp } from "./context/AppContext";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Beranda from "./pages/Beranda";
import RisetSaya from "./pages/RisetSaya";
import Notifikasi from "./pages/Notifikasi";
import Riset from "./pages/Riset";
import DetailRiset from "./pages/DetailRiset";
import Komentar from "./pages/Komentar";
import UploadRiset from "./pages/UploadRiset";
import Kolaborasi from "./pages/Kolaborasi";
import KolaborasiProses from "./pages/KolaborasiProses";
import Chat from "./pages/Chat";
import Profil from "./pages/Profil";
import EditProfil from "./pages/EditProfil";
import Pengaturan from "./pages/Pengaturan";
import MatchmakingAI from "./pages/MatchmakingAI";

function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:bottom-8">
      <div className="fade-up rounded-full bg-ink/90 px-4 py-2.5 text-[13px] font-medium text-white shadow-soft dark:bg-white/90 dark:text-ink">
        {toast}
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose }) {
  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}>
      <div onClick={onClose} className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        className={`absolute left-0 top-0 h-full w-72 max-w-[80%] transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="tap absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white"
        >
          <X size={16} />
        </button>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const { authed } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!authed) {
    return (
      <>
        <LandingPage />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 dark:bg-[#0b1420]">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <div className="hidden shrink-0 lg:block lg:w-64">
          <div className="fixed h-screen w-64">
            <Sidebar />
          </div>
        </div>

        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
          <Topbar onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 pb-20 lg:pb-10">
            <div key={location.pathname} className="fade-in">
              <Routes location={location}>
                <Route path="/" element={<Beranda />} />
                <Route path="/riset-saya" element={<RisetSaya />} />
                <Route path="/notifikasi" element={<Notifikasi />} />
                <Route path="/riset" element={<Riset />} />
                <Route path="/riset/:id" element={<DetailRiset />} />
                <Route path="/riset/:id/komentar" element={<Komentar />} />
                <Route path="/upload" element={<UploadRiset />} />
                <Route path="/kolaborasi" element={<Kolaborasi />} />
                <Route path="/kolaborasi/proses/:id" element={<KolaborasiProses />} />
                <Route path="/kolaborasi/chat/:id" element={<Chat />} />
                <Route path="/matchmaking" element={<MatchmakingAI />} />
                <Route path="/profil" element={<Profil />} />
                <Route path="/profil/edit" element={<EditProfil />} />
                <Route path="/pengaturan" element={<Pengaturan />} />
                <Route path="*" element={<Beranda />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      <BottomNav />
      <Toast />
    </div>
  );
}
