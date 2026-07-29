import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  risetList,
  notifications as notifSeed,
  collaborationsMasuk,
  collaborationsBerjalan,
  industryCollabPengajuan,
  industryCollabBerjalan,
  commentsSeed,
  userMahasiswa,
  userIndustri,
} from "../data/mockData";

const AppContext = createContext(null);



// Baca sesi yang tersimpan dari localStorage
function getInitialAuth() {
  try {
    const authed = window.localStorage.getItem("risetin-authed") === "true";
    const role = window.localStorage.getItem("risetin-role") || "mahasiswa";
    return { authed, role };
  } catch {
    return { authed: false, role: "mahasiswa" };
  }
}

export function AppProvider({ children }) {
  const initialAuth = getInitialAuth();
  const [authed, setAuthed] = useState(initialAuth.authed);
  const [role, setRole] = useState(initialAuth.role);

  const [riset, setRiset] = useState(() =>
    risetList.map((r) => ({
      ...r,
      liked: false,
      // pakai jumlah komentar aktual dari commentsSeed, default 0
      komentar: commentsSeed[r.id]?.length ?? 0,
    }))
  );
  const [comments, setComments] = useState(commentsSeed);
  const [notifications, setNotifications] = useState(notifSeed);
  const [masuk, setMasuk] = useState(collaborationsMasuk);
  const [berjalan, setBerjalan] = useState(collaborationsBerjalan);
  const [indPengajuan, setIndPengajuan] = useState(industryCollabPengajuan);
  const [indBerjalan, setIndBerjalan] = useState(industryCollabBerjalan);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2400);
  };

  const login = ({ email }) => {
    const isIndustri = /industri/i.test(email || "");
    const newRole = isIndustri ? "industri" : "mahasiswa";
    setRole(newRole);
    setAuthed(true);
    // Simpan sesi ke localStorage agar tidak hilang saat refresh
    window.localStorage.setItem("risetin-authed", "true");
    window.localStorage.setItem("risetin-role", newRole);
    showToast(isIndustri ? "Berhasil masuk sebagai Industri" : "Berhasil masuk sebagai Mahasiswa");
  };

  const logout = () => {
    setAuthed(false);
    // Hapus sesi dari localStorage
    window.localStorage.removeItem("risetin-authed");
    window.localStorage.removeItem("risetin-role");
    showToast("Anda telah keluar");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  const acceptMasuk = (id) => {
    const item = masuk.find((m) => m.id === id);
    if (!item) return;
    setMasuk((prev) => prev.filter((m) => m.id !== id));
    setBerjalan((prev) => [
      { id: "p" + Date.now(), risetId: item.risetId, perusahaan: item.perusahaan, updated: "baru saja", tahap: 0 },
      ...prev,
    ]);
    showToast(`Kolaborasi dengan ${item.perusahaan} diterima`);
  };

  const rejectMasuk = (id) => {
    const item = masuk.find((m) => m.id === id);
    setMasuk((prev) => prev.filter((m) => m.id !== id));
    if (item) showToast(`Permintaan dari ${item.perusahaan} ditolak`);
  };

  const advanceStage = (id) => {
    setBerjalan((prev) => prev.map((p) => (p.id === id ? { ...p, tahap: Math.min(p.tahap + 1, 4) } : p)));
  };

  const addRiset = (item) => {
    setRiset((prev) => [{ ...item, liked: false }, ...prev]);
  };

  const toggleLike = (id) => {
    setRiset((prev) =>
      prev.map((r) => (r.id === id ? { ...r, liked: !r.liked, suka: r.liked ? r.suka - 1 : r.suka + 1 } : r))
    );
  };

  const addComment = (risetId, text) => {
    const entry = {
      id: "cm" + Date.now(),
      nama: role === "mahasiswa" ? userMahasiswa.nama : userIndustri.nama,
      inisial: role === "mahasiswa" ? userMahasiswa.inisial : userIndustri.inisial,
      text,
      time: "Baru saja",
    };
    setComments((prev) => ({ ...prev, [risetId]: [...(prev[risetId] || []), entry] }));
    setRiset((prev) => prev.map((r) => (r.id === risetId ? { ...r, komentar: r.komentar + 1 } : r)));
  };

  const value = useMemo(
    () => ({
      authed,
      login,
      logout,
      role,
      setRole,
      user: role === "mahasiswa" ? userMahasiswa : userIndustri,
      riset,
      addRiset,
      toggleLike,
      comments,
      addComment,
      notifications,
      unreadCount,
      markAllRead,
      masuk,
      berjalan,
      acceptMasuk,
      rejectMasuk,
      advanceStage,
      indPengajuan,
      indBerjalan,
      toast,
      showToast,
    }),
    [
      authed,
      role,
      riset,
      comments,
      notifications,
      unreadCount,
      masuk,
      berjalan,
      indPengajuan,
      indBerjalan,
      toast,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
