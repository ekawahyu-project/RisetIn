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

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("risetin-theme");
  if (saved) return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function AppProvider({ children }) {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState("mahasiswa"); // "mahasiswa" | "industri"
  const [theme, setTheme] = useState(getInitialTheme);

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
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem("risetin-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2400);
  };

  const login = ({ email }) => {
    const isIndustri = /industri/i.test(email || "");
    setRole(isIndustri ? "industri" : "mahasiswa");
    setAuthed(true);
    showToast(isIndustri ? "Berhasil masuk sebagai Industri" : "Berhasil masuk sebagai Mahasiswa");
  };

  const logout = () => {
    setAuthed(false);
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
      theme,
      toggleTheme,
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
      theme,
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
