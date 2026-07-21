import React, { createContext, useContext, useMemo, useState } from "react";
import {
  risetList,
  notifications as notifSeed,
  collaborationsMasuk,
  collaborationsBerjalan,
  industryCollabPengajuan,
  industryCollabBerjalan,
  userMahasiswa,
  userIndustri,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState("mahasiswa"); // "mahasiswa" | "industri"
  const [riset, setRiset] = useState(risetList);
  const [notifications, setNotifications] = useState(notifSeed);
  const [masuk, setMasuk] = useState(collaborationsMasuk);
  const [berjalan, setBerjalan] = useState(collaborationsBerjalan);
  const [indPengajuan, setIndPengajuan] = useState(industryCollabPengajuan);
  const [indBerjalan, setIndBerjalan] = useState(industryCollabBerjalan);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2400);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

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
    setBerjalan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, tahap: Math.min(p.tahap + 1, 4) } : p))
    );
  };

  const addRiset = (item) => {
    setRiset((prev) => [{ ...item }, ...prev]);
  };

  const value = useMemo(
    () => ({
      role,
      setRole,
      user: role === "mahasiswa" ? userMahasiswa : userIndustri,
      riset,
      addRiset,
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
    [role, riset, notifications, unreadCount, masuk, berjalan, indPengajuan, indBerjalan, toast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
